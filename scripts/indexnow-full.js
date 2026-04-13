/**
 * IndexNow 全量提交脚本
 * 提交站点所有 URL 到 Bing 搜索引擎
 *
 * 使用方法:
 * 1. 设置环境变量 INDEXNOW_KEY 和 INDEXNOW_KEY_LOCATION
 * 2. 运行: npm run indexnow:full
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { config } from 'dotenv';

// 加载环境变量
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ 配置区域 ============
const SITE_URL = process.env.SITE_URL || 'https://chatgpt6-china.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const INDEXNOW_KEY_LOCATION = process.env.INDEXNOW_KEY_LOCATION || `${SITE_URL}/.well-known/indexnow-key.txt`;
const BING_API_URL = 'https://www.bing.com/indexnow';

// IndexNow 支持的搜索引擎端点
const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',  // Bing
  'https://yandex.com/indexnow',    // Yandex
];

// ============ 工具函数 ============

/**
 * 扫描 docs 目录下的所有 .md 文件，生成 URL 列表
 */
function scanMarkdownFiles(dir, baseDir) {
  const urls = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // 跳过 .vitepress 和 public 目录
      if (!['.vitepress', 'public', 'node_modules'].includes(file.name)) {
        urls.push(...scanMarkdownFiles(fullPath, baseDir));
      }
    } else if (file.name.endsWith('.md')) {
      // 跳过 index.md 和 README.md
      if (file.name === 'index.md' || file.name === 'README.md') {
        // 目录首页，转换为 /
        const dirPath = path.relative(baseDir, dir);
        const urlPath = dirPath === '' ? '/' : `/${dirPath.replace(/\\/g, '/')}/`;
        urls.push(`${SITE_URL}${urlPath}`);
      } else {
        // 普通文章，移除 .md 后缀
        const relativePath = path.relative(baseDir, fullPath);
        const urlPath = `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`;
        urls.push(`${SITE_URL}${urlPath}`);
      }
    }
  }

  return urls;
}

/**
 * 从 config.mjs 读取导航配置，补充额外页面 URL
 */
function getExtraUrls() {
  return [
    SITE_URL,
    `${SITE_URL}/sitemap.xml`,
  ];
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
  if (urls.length === 0) {
    console.log('没有需要提交的 URL');
    return;
  }

  console.log(`\n准备提交 ${urls.length} 个 URL 到 IndexNow...\n`);

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION.replace(SITE_URL, ''),
    urlList: urls,
  };

  let successCount = 0;
  let failCount = 0;

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      console.log(`正在提交到 ${endpoint}...`);
      const result = await postJson(endpoint, payload);

      if (result.status === 200) {
        console.log(`✓ ${endpoint} 提交成功`);
        successCount++;
      } else if (result.status === 429) {
        console.log(`⚠ ${endpoint} 请求过于频繁，等待后重试...`);
        await new Promise(r => setTimeout(r, 60000));
        const retryResult = await postJson(endpoint, payload);
        if (retryResult.status === 200) {
          console.log(`✓ ${endpoint} 重试成功`);
          successCount++;
        } else {
          console.log(`✗ ${endpoint} 提交失败: ${result.status} - ${result.body}`);
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

  console.log(`\n提交完成: ${successCount} 成功, ${failCount} 失败`);
  return { successCount, failCount };
}

/**
 * 保存提交记录
 */
function saveSubmitRecord(urls) {
  const recordPath = path.join(__dirname, '..', '.indexnow-record.json');
  const record = {
    lastRun: new Date().toISOString(),
    urlsCount: urls.length,
    urls: urls,
  };
  fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
  console.log(`\n提交记录已保存到 .indexnow-record.json`);
}

// ============ 主流程 ============
async function main() {
  console.log('═'.repeat(60));
  console.log('  IndexNow 全量提交工具');
  console.log('═'.repeat(60));

  // 验证配置
  if (!INDEXNOW_KEY) {
    console.error('\n✗ 错误: 未设置 INDEXNOW_KEY 环境变量');
    console.log('请在 .env 文件中设置你的 IndexNow API Key');
    console.log('从 Bing Webmaster Tools 获取: https://www.bing.com/webmasters');
    process.exit(1);
  }

  // 生成 URL 列表
  const docsDir = path.join(__dirname, '..', 'docs');
  const urls = [
    ...scanMarkdownFiles(docsDir, docsDir),
    ...getExtraUrls(),
  ];

  // 去重
  const uniqueUrls = [...new Set(urls)];
  console.log(`\n扫描到 ${uniqueUrls.length} 个 URL`);

  // 显示 URL 列表
  console.log('\nURL 列表:');
  uniqueUrls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

  // 提交
  const result = await submitToIndexNow(uniqueUrls);

  if (result.successCount > 0) {
    saveSubmitRecord(uniqueUrls);
  }

  console.log('\n' + '═'.repeat(60));
}

main().catch(console.error);
