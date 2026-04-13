#!/bin/bash

# 创建 .env 文件（从示例文件复制）
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo ".env 文件已创建，请编辑并填入你的配置"
  else
    cat > .env << 'EOF'
# IndexNow API Key（从 Bing Webmaster Tools 获取）
INDEXNOW_KEY=5ef3feed53d046cba5cef04ac56c0758
INDEXNOW_KEY_LOCATION=https://www.chatgpt6-china.com/.well-known/indexnow-key.txt

# 网站域名
SITE_URL=https://www.chatgpt6-china.com

# Bing Webmaster Tools API Key
BING_API_KEY=898f9e3de7be4c55be813a083436470d
EOF
    echo ".env 文件已创建，请编辑并填入你的配置"
  fi
else
  echo ".env 文件已存在"
fi

# 创建 indexnow-key.txt（用于站点验证）
if [ ! -f ".well-known/indexnow-key.txt" ]; then
  mkdir -p .well-known
  echo "your-indexnow-api-key-here" > .well-known/indexnow-key.txt
  echo ".well-known/indexnow-key.txt 已创建"
fi
