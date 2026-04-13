/**
 * IndexNow 增量提交脚本
 * 只提交新增或更新的文章
 *
 * 原理:
 * 1. 读取上次的提交记录 (.indexnow-record.json)
 * 2. 扫描 docs 目录，比较文件修改时间
 * 3. 提交有变化的 URL
 *
 * 使用方法:
 * 1. 确保已运行过一次全量提交
 * 2. 运行: npm run indexnow:updated
 */

import { config } from 'dotenv';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ 配置区域 ============
const SITE_URL = process.env.SITE_URL || 'https://www.chatgpt6-china.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const INDEXNOW_KEY_LOCATION = process.env.INDEXNOW_KEY_LOCATION || `${SITE_URL}/.well-known/indexnow-key.txt`;
const RECORD_FILE = path.join(__dirname, '..', '.indexnow-record.json');

// IndexNow 支持的搜索引擎端点
const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

// ============ 工具函数 ============

/**
 * 扫描单个 markdown 文件并返回 URL 信息
 */
function scanMarkdownFile(filePath, baseDir) {
  const stat = fs.statSync(filePath);
  const relativePath = path.relative(baseDir, filePath);

  let urlPath;
  const fileName = path.basename(filePath);

  // README.md 通常是目录索引页面，不作为独立页面处理
  if (fileName === 'README.md') {
    return null;
  }

  if (fileName === 'index.md') {
    const dirPath = path.dirname(relativePath);
    urlPath = dirPath === '.' ? '/' : `/${dirPath.replace(/\\/g, '/')}/`;
  } else {
    // 普通文章（.html 后缀，VitePress cleanUrls: false）
    urlPath = `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '.html')}`;
  }

  return {
    url: `${SITE_URL}${urlPath}`,
    filePath: relativePath,
    mtime: stat.mtime.getTime(),
  };
}

/**
 * 递归扫描 docs 目录
 */
function scanDocsDir(dir, baseDir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!['.vitepress', 'public', 'node_modules'].includes(entry.name)) {
        results.push(...scanDocsDir(fullPath, baseDir));
      }
    } else if (entry.name.endsWith('.md')) {
      const result = scanMarkdownFile(fullPath, baseDir);
      if (result) {
        results.push(result);
      }
    }
  }

  return results;
}

/**
 * 读取上次的提交记录
 */
function loadLastRecord() {
  if (!fs.existsSync(RECORD_FILE)) {
    return null;
  }

  try {
    const content = fs.readFileSync(RECORD_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('读取记录文件失败:', e.message);
    return null;
  }
}

/**
 * 比较找出新增或更新的文件
 */
function findChangedUrls(currentFiles, lastRecord) {
  if (!lastRecord) {
    console.log('没有历史记录，执行全量提交...');
    return currentFiles.map(f => f.url);
  }

  const lastUrls = new Map(
    lastRecord.urls.map(u => [u.url, u])
  );

  const changed = [];

  for (const file of currentFiles) {
    const lastFile = lastUrls.get(file.url);

    if (!lastFile) {
      // 新增文件
      changed.push(file.url);
      console.log(`  + 新增: ${file.url}`);
    } else if (file.mtime > new Date(lastRecord.lastRun).getTime()) {
      // 更新文件
      changed.push(file.url);
      console.log(`  ~ 更新: ${file.url}`);
    }
  }

  return changed;
}

/**
 * 发送 HTTP POST 请求
 */
function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body,
        });
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * 提交 URL 列表到 IndexNow
 */
async function submitToIndexNow(urls) {
  // URL 去重（移除末尾斜杠后的重复）
  const seen = new Set();
  const uniqueUrls = [];
  for (const url of urls) {
    const normalized = url.endsWith('/') ? url.slice(0, -1) : url;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueUrls.push(url);
    }
  }

  if (urls.length !== uniqueUrls.length) {
    console.log(`\n去重: ${urls.length} -> ${uniqueUrls.length} 个 URL`);
  }

  if (uniqueUrls.length === 0) {
    console.log('\n没有需要提交的 URL（所有文章均无变化）');
    return { successCount: 0, failCount: 0 };
  }

  console.log(`\n准备提交 ${uniqueUrls.length} 个 URL 到 IndexNow...\n`);

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION.replace(SITE_URL, ''),
    urlList: uniqueUrls,
  };

  let successCount = 0;
  let failCount = 0;

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      console.log(`正在提交到 ${endpoint}...`);
      const result = await postJson(endpoint, payload);

      if (result.status === 200 || result.status === 202) {
        // 200 = 成功, 202 = 已接受（URL 收到，key 验证待处理）
        const msg = result.status === 200
          ? `✓ ${endpoint} 提交成功`
          : `✓ ${endpoint} 已接受（等待 key 验证）`;
        console.log(msg);
        successCount++;
      } else if (result.status === 429) {
        console.log(`⚠ ${endpoint} 请求过于频繁，等待 60 秒后重试...`);
        await new Promise(r => setTimeout(r, 60000));
        const retryResult = await postJson(endpoint, payload);
        if (retryResult.status === 200 || retryResult.status === 202) {
          console.log(`✓ ${endpoint} 重试成功`);
          successCount++;
        } else {
          console.log(`✗ ${endpoint} 提交失败: ${retryResult.status} - ${retryResult.body}`);
          failCount++;
        }
      } else {
        console.log(`✗ ${endpoint} 提交失败: ${result.status} - ${result.body}`);
        failCount++;
      }
    } catch (error) {
      console.log(`✗ ${endpoint} 错误: ${error.message}`);
      failCount++;
    }
  }

  return { successCount, failCount };
}

/**
 * 保存新的提交记录
 */
function saveRecord(urls, currentFiles) {
  const filesMap = new Map(currentFiles.map(f => [f.url, f]));

  const record = {
    lastRun: new Date().toISOString(),
    urlsCount: urls.length,
    urls: urls.map(url => {
      const file = filesMap.get(url);
      return {
        url,
        filePath: file ? file.filePath : '',
        mtime: file ? new Date(file.mtime).toISOString() : '',
      };
    }),
  };

  fs.writeFileSync(RECORD_FILE, JSON.stringify(record, null, 2));
  console.log(`\n提交记录已更新到 .indexnow-record.json`);
}

// ============ 主流程 ============
async function main() {
  console.log('═'.repeat(60));
  console.log('  IndexNow 增量提交工具');
  console.log('═'.repeat(60));

  // 验证配置
  if (!INDEXNOW_KEY) {
    console.error('\n✗ 错误: 未设置 INDEXNOW_KEY 环境变量');
    console.log('请在 .env 文件中设置你的 IndexNow API Key');
    process.exit(1);
  }

  // 加载上次记录
  const lastRecord = loadLastRecord();

  // 扫描当前文件
  const docsDir = path.join(__dirname, '..', 'docs');
  const currentFiles = scanDocsDir(docsDir, docsDir);

  console.log(`\n扫描到 ${currentFiles.length} 个文件`);
  console.log('\n变化检测:');

  // 找出有变化的文件
  const changedUrls = findChangedUrls(currentFiles, lastRecord);

  // 提交
  const result = await submitToIndexNow(changedUrls);

  if (result.successCount > 0) {
    saveRecord(changedUrls, currentFiles);
  }

  console.log('\n' + '═'.repeat(60));
}

main().catch(console.error);
