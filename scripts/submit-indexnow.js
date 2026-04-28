import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');  // 脚本在 docs/script/ 下，需要上两层到项目根目录
const PUBLIC_DIR = path.join(ROOT_DIR, 'docs/public');
const CHANGED_URLS_FILE = path.join(ROOT_DIR, 'changed-urls.json');
const HOST = 'www.chatgpt6-china.com';
const INDEXNOW_ENDPOINT = 'api.indexnow.org';

// Find API key file
function findApiKey() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Error: Public directory not found at ${PUBLIC_DIR}`);
    return null;
  }

  const files = fs.readdirSync(PUBLIC_DIR);
  // IndexNow key file usually has the name equal to the key content, e.g., "abc123xyz.txt" containing "abc123xyz"
  // Or just any .txt file that looks like a key.
  // We will look for a .txt file that is NOT robots.txt
  const keyFiles = files.filter(f => f.endsWith('.txt') && f !== 'robots.txt');

  if (keyFiles.length === 0) {
    console.error('Error: No API key file found in docs/public/. Please download the key file from Bing Webmaster Tools and place it there.');
    return null;
  }

  if (keyFiles.length > 1) {
    console.warn(`Warning: Multiple .txt files found. Using the first one: ${keyFiles[0]}`);
  }

  const keyFile = keyFiles[0];
  const key = keyFile.replace('.txt', '');
  return key;
}

// 读取变更记录文件
function readChangedUrls() {
  if (fs.existsSync(CHANGED_URLS_FILE)) {
    try {
      const content = fs.readFileSync(CHANGED_URLS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('Warning: Failed to read changed-urls.json');
      return { urls: [], lastUpdated: null };
    }
  }
  return { urls: [], lastUpdated: null };
}

// 清空变更记录
function clearChangedUrls() {
  if (fs.existsSync(CHANGED_URLS_FILE)) {
    const emptyData = { urls: [], lastUpdated: null };
    fs.writeFileSync(CHANGED_URLS_FILE, JSON.stringify(emptyData, null, 2), 'utf-8');
    console.log('✅ 已清空变更记录文件');
  }
}

function submitUrls(urls, clearAfterSubmit = false) {
  const key = '5ef3feed53d046cba5cef04ac56c0758';// findApiKey();
  if (!key) return;

  const data = JSON.stringify({
    host: HOST,
    key: key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls
  });

  const options = {
    hostname: INDEXNOW_ENDPOINT,
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log('✅ 成功：URLs 已提交到 IndexNow');
        if (clearAfterSubmit) {
          //clearChangedUrls();
        }
      } else {
        console.error('❌ 提交失败:', responseBody);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求错误:', error);
  });

  req.write(data);
  req.end();
}

// Main execution
const args = process.argv.slice(2);
let urlsToSubmit = [];

// 如果提供了参数，使用参数中的 URL
if (args.length > 0) {
  // 检查是否有 --clear 标志
  const clearFlagIndex = args.indexOf('--clear');
  const shouldClear = clearFlagIndex !== -1;
  if (shouldClear) {
    args.splice(clearFlagIndex, 1);
  }

  // 验证 URL
  urlsToSubmit = args.filter(url => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error(`❌ 无效的 URL，已忽略: ${url}`);
      return false;
    }
  });
} else {
  // 如果没有提供参数，从变更记录文件读取
  console.log('📖 从变更记录文件读取 URL...\n');
  const changedData = readChangedUrls();
  
  if (changedData.urls.length === 0) {
    console.log('ℹ️  变更记录文件中没有 URL。');
    console.log('\n💡 使用方法：');
    console.log('   1. 运行 "npm run track-changes" 来记录变更的文章');
    console.log('   2. 或者直接提供 URL 作为参数：');
    console.log('      node scripts/submit-indexnow.js <url1> <url2> ...');
    console.log('   3. 使用 --clear 标志在提交后清空变更记录：');
    console.log('      node scripts/submit-indexnow.js --clear');
    process.exit(0);
  }
  
  urlsToSubmit = changedData.urls;
  console.log(`📋 找到 ${urlsToSubmit.length} 个待提交的 URL（最后更新：${changedData.lastUpdated || '未知'}）\n`);
}

if (urlsToSubmit.length > 0) {
  console.log('📤 正在提交以下 URL 到 IndexNow：');
  urlsToSubmit.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });
  console.log();
  
  // 如果是从文件读取的，默认提交后清空
  const shouldClear = args.length === 0 || args.includes('--clear');
  submitUrls(urlsToSubmit, shouldClear);
} else {
  console.log('❌ 没有有效的 URL 可提交。');
}
