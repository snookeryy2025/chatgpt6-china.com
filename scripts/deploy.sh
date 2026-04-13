#!/bin/bash

# =============================================================================
# ChatGPT6中国 - 自动部署脚本
# 支持 Vercel、Netlify 和传统服务器部署
# =============================================================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_step() {
  echo -e "${GREEN}==>${NC} $1"
}

echo_warn() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

echo_error() {
  echo -e "${RED}ERROR:${NC} $1"
}

# =============================================================================
# 配置
# =============================================================================

# 项目目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# 构建输出目录
DIST_DIR="$PROJECT_DIR/docs/.vitepress/dist"

# =============================================================================
# 步骤 1: 安装依赖
# =============================================================================

echo_step "步骤 1: 安装依赖..."
if [ ! -d "node_modules" ]; then
  npm install
else
  echo "  依赖已安装，跳过"
fi

# =============================================================================
# 步骤 2: 构建项目
# =============================================================================

echo_step "步骤 2: 构建项目..."
npm run build

if [ ! -d "$DIST_DIR" ]; then
  echo_error "构建失败，dist 目录不存在"
  exit 1
fi

echo "  构建成功，共 $(find "$DIST_DIR" -type f | wc -l | tr -d ' ') 个文件"

# =============================================================================
# 步骤 3: 生成 sitemap.xml
# =============================================================================

echo_step "步骤 3: 生成 sitemap.xml..."
npm run sitemap

# =============================================================================
# 步骤 4: 提交 IndexNow
# =============================================================================

echo_step "步骤 4: 提交 IndexNow..."

if [ -z "$INDEXNOW_KEY" ]; then
  echo_warn "未设置 INDEXNOW_KEY 环境变量，跳过 IndexNow 提交"
  echo "  如需提交，请设置环境变量: export INDEXNOW_KEY=your-key"
else
  echo "  检测到 INDEXNOW_KEY，开始提交..."

  # 根据提交模式选择脚本
  if [ "$1" == "--full" ]; then
    echo "  执行全量提交..."
    npm run indexnow:full
  else
    echo "  执行增量提交..."
    npm run indexnow:updated
  fi
fi

# =============================================================================
# 步骤 5: 部署
# =============================================================================

echo_step "步骤 5: 部署..."

if [ "$DEPLOY_TARGET" == "vercel" ]; then
  echo "  部署到 Vercel..."
  npx vercel --prod

elif [ "$DEPLOY_TARGET" == "netlify" ]; then
  echo "  部署到 Netlify..."
  npx netlify deploy --prod --dir="$DIST_DIR"

elif [ "$DEPLOY_TARGET" == "server" ]; then
  echo "  部署到服务器..."
  if [ -z "$DEPLOY_SERVER" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
    echo_error "服务器部署需要设置 DEPLOY_SERVER, DEPLOY_USER, DEPLOY_PATH 环境变量"
    exit 1
  fi

  rsync -avz --delete \
    -e "ssh -p ${DEPLOY_PORT:-22}" \
    "$DIST_DIR/" \
    "$DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH"

else
  echo_warn "未设置 DEPLOY_TARGET，跳过部署"
  echo ""
  echo "  部署选项:"
  echo "    export DEPLOY_TARGET=vercel   # 部署到 Vercel"
  echo "    export DEPLOY_TARGET=netlify  # 部署到 Netlify"
  echo "    export DEPLOY_TARGET=server   # 部署到自建服务器"
  echo ""
  echo "  或手动部署 dist 目录: $DIST_DIR"
fi

# =============================================================================
# 完成
# =============================================================================

echo ""
echo_step "部署完成！"
echo ""
echo "  本地预览: npm run preview"
echo "  访问地址: http://localhost:4173"
