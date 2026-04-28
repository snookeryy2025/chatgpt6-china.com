import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const CHANGED_URLS_FILE = path.join(ROOT_DIR, 'changed-urls.json');
const HOST = 'www.chatgpt6-china.com';

// 将文件路径转换为 URL
function filePathToUrl(filePath) {
  // 获取相对于 docs 目录的路径
  const relativePath = path.relative(DOCS_DIR, filePath);
  
  // 移除 .md 扩展名
  const pathWithoutExt = relativePath.replace(/\.md$/, '');
  
  // 处理特殊文件
  if (pathWithoutExt === 'index') {
    return `https://${HOST}/`;
  }
  
  // 构建 URL
  const urlPath = pathWithoutExt.split(path.sep).join('/');
  return `https://${HOST}/${urlPath}.html`;
}

// 检测变更的文件
function getChangedFiles() {
  try {
    // 获取已暂存的文件（git add 后的文件）
    const stagedFiles = execSync('git diff --staged --name-only --diff-filter=ACMR', {
      cwd: ROOT_DIR,
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    // 获取工作区中已修改但未暂存的文件
    const modifiedFiles = execSync('git diff --name-only --diff-filter=ACMR', {
      cwd: ROOT_DIR,
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    // 获取未跟踪的新文件（未添加到 git 的新文件）
    const untrackedFiles = execSync('git ls-files --others --exclude-standard', {
      cwd: ROOT_DIR,
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    // 合并并去重
    const allChangedFiles = [...new Set([...stagedFiles, ...modifiedFiles, ...untrackedFiles])];
    
    // 只保留 docs 目录下的 .md 文件
    return allChangedFiles
      .filter(file => {
        const fullPath = path.join(ROOT_DIR, file);
        return file.startsWith('docs/') && 
               file.endsWith('.md') && 
               fs.existsSync(fullPath);
      })
      .map(file => path.join(ROOT_DIR, file));
  } catch (error) {
    console.error('Error detecting changed files:', error.message);
    return [];
  }
}

// 读取现有的变更记录
function readChangedUrls() {
  if (fs.existsSync(CHANGED_URLS_FILE)) {
    try {
      const content = fs.readFileSync(CHANGED_URLS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('Warning: Failed to read changed-urls.json, creating new file.');
      return { urls: [], lastUpdated: null };
    }
  }
  return { urls: [], lastUpdated: null };
}

// 保存变更记录
function saveChangedUrls(data) {
  const jsonData = {
    urls: [...new Set(data.urls)], // 去重
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(CHANGED_URLS_FILE, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`✅ 已记录 ${jsonData.urls.length} 个变更的 URL 到 ${CHANGED_URLS_FILE}`);
}

// 主函数
function main() {
  console.log('🔍 正在检测变更的文章...\n');
  
  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    console.log('ℹ️  没有检测到变更的文章文件。');
    return;
  }
  
  console.log(`📝 检测到 ${changedFiles.length} 个变更的文件：`);
  changedFiles.forEach(file => {
    const relativePath = path.relative(ROOT_DIR, file);
    console.log(`   - ${relativePath}`);
  });
  console.log();
  
  // 转换为 URL
  const urls = changedFiles.map(filePathToUrl);
  
  // 读取现有记录
  const existingData = readChangedUrls();
  
  // 合并新的 URL（去重）
  const allUrls = [...new Set([...existingData.urls, ...urls])];
  
  // 保存
  saveChangedUrls({ urls: allUrls });
  
  console.log('\n📋 变更的 URL 列表：');
  urls.forEach(url => {
    console.log(`   ${url}`);
  });
  console.log(`\n💡 提示：运行 'npm run submit-indexnow' 来提交这些 URL 到 IndexNow`);
}

main();

