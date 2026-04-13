/**
 * 中心化路由配置文件
 * 自动扫描 markdown 文件生成路由和 sitemap
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import matter from 'gray-matter'
import { join, relative } from 'path'

export interface RouteItem {
  url: string
  title: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

// 应该排除的目录和文件模式
const EXCLUDE_PATTERNS = [
  '.vitepress',
  'node_modules',
  'script',
  'public',
  'README.md',
  'CLAUDE.md',
]

// 检查路径是否应该被排除
function shouldExclude(relativePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => 
    relativePath.includes(pattern) || relativePath.endsWith(pattern)
  )
}

// 自动扫描 markdown 文件
function scanMarkdownFiles(dir: string, baseDir: string = dir): RouteItem[] {
  const routes: RouteItem[] = []
  
  try {
    const files = readdirSync(dir)
    
    for (const file of files) {
      const fullPath = join(dir, file)
      const relativePath = relative(baseDir, fullPath)
      
      // 检查是否应该排除
      if (shouldExclude(relativePath)) {
        continue
      }
      
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        routes.push(...scanMarkdownFiles(fullPath, baseDir))
      } else if (file.endsWith('.md')) {
        try {
          // 读取文件内容
          const content = readFileSync(fullPath, 'utf-8')
          const { data: frontmatter } = matter(content)
          
          // 生成 URL
          const relativePath = relative(baseDir, fullPath)
          let url = '/' + relativePath
            .replace(/\\/g, '/')
            .replace(/\.md$/, '.html')
            .replace(/\/index\.html$/, '/')
          
          // 获取标题
          let title = frontmatter.title || ''
          
          // 如果 frontmatter 中没有标题，尝试从第一个 # 标题中提取
          if (!title) {
            const match = content.match(/^#\s+(.+)$/m)
            if (match) {
              title = match[1].trim()
            } else {
              // 如果还是没有标题，使用文件名
              title = file.replace(/\.md$/, '')
            }
          }
          
          // 确定 changefreq 和 priority
          let changefreq: RouteItem['changefreq'] = frontmatter.changefreq || 'weekly'
          let priority = frontmatter.priority
          
          // 根据路径自动设置优先级
          if (priority === undefined) {
            if (url === '/' || url === '/index.html') {
              priority = 1.0
            } else if (url.includes('/guides/chatgpt/') || url.includes('/blog/chatgpt-cn/')) {
              priority = 0.9
              changefreq = 'daily'
            } else if (url.includes('/guides/') || url.includes('/blog/')) {
              priority = 0.8
              changefreq = 'daily'
            } else {
              priority = 0.7
            }
          }
          
          routes.push({
            url,
            title,
            changefreq,
            priority
          })
        } catch (error) {
          console.warn(`Error processing file ${fullPath}:`, error)
        }
      }
    }
  } catch (error) {
    console.warn(`Error scanning directory ${dir}:`, error)
  }
  
  return routes
}

// 获取所有自动扫描的路由
function getAutoRoutes(): RouteItem[] {
  const docsDir = join(process.cwd(), 'docs')
  
  if (!existsSync(docsDir)) {
    console.warn('Docs directory not found, returning empty routes')
    return []
  }
  
  return scanMarkdownFiles(docsDir)
}

export interface SidebarGroup {
  text: string
  collapsed?: boolean
  items: Array<{
    text: string
    link: string
    items?: Array<{
      text: string
      link: string
    }>
  }>
}

// 生成侧边栏配置（现在从自动扫描的路由生成）
export function generateSidebarConfig() {
  const allRoutes = getAllRoutes()
  
  // 按路径分类路由
  const aiToolRoutes = allRoutes.filter(r => r.url.startsWith('/ai-tools/') && r.url !== '/ai-tools/')
  const modelsRoutes = allRoutes.filter(r => r.url.startsWith('/models/') && r.url !== '/models/')
  const usageRoutes = allRoutes.filter(r => r.url.startsWith('/usage/') && r.url !== '/usage/')
  const claudeRoutes = allRoutes.filter(r => r.url.startsWith('/claude-cn/') && r.url !== '/claude-cn/')

  const blogRoutes = allRoutes.filter(r => r.url.startsWith('/blog/') && r.url !== '/blog/')
  // 二级目录
   // 进一步分类 blog
   const chatgptCnBlog = blogRoutes.filter(r => r.url.includes('/blog/chatgpt'))
  


  return {
    '/ai-tools/': aiToolRoutes.length > 0 ? [
      {
        text: 'ChatGPT指南',
        collapsed: false,
        items: aiToolRoutes.map(item => ({ text: item.title, link: item.url }))
      }
    ] : [],
    '/blog/chatgpt/': chatgptCnBlog.length > 0 ? [
      {
        text: 'ChatGPT中文博客',
        collapsed: false,
        items: chatgptCnBlog.map(item => ({ text: item.title, link: item.url }))
      }
    ] : [],
    '/models/': modelsRoutes.length > 0 ? [
      {
        text: 'GPT模型',
        collapsed: false,
        items: modelsRoutes.map(item => ({ text: item.title, link: item.url }))
      }
    ] : [],
    '/usage/': usageRoutes.length > 0 ? [
      {
        text: '国内使用',
        collapsed: false,
        items: usageRoutes.map(item => ({ text: item.title, link: item.url }))
      }
    ] : [],
    '/claude-cn/': claudeRoutes.length > 0 ? [
      {
        text: 'Claude 中文版',
        collapsed: false,
        items: claudeRoutes.map(item => ({ text: item.title, link: item.url }))
      }
    ] : []
  }
}

// 生成所有路由链接（用于 sitemap）
export function getAllRoutes(): RouteItem[] {
  // 使用自动扫描的路由
  return getAutoRoutes()
}

// 按类别组织的路由（用于 HTML sitemap）
export function getRoutesByCategory() {
  const allRoutes = getAllRoutes()
  
  // 按路径自动分类
  const categories: { [key: string]: RouteItem[] } = {
    '主要页面': [],
    'ChatGPT 使用指南': [],
    'ChatGPT 国内使用': [],
    'ChatGPT 博客': [],
    'AI 工具': [],
    'DeepSeek 指南': [],
    'Gemini 指南': [],
    'OpenAI 开发': [],
    '写作指南': [],
    '其他': []
  }
  
  for (const route of allRoutes) {
    if (route.url === '/' || route.url === '/index.html') {
      categories['主要页面'].push(route)
    } else if (route.url.includes('/guides/chatgpt/')) {
      categories['ChatGPT 使用指南'].push(route)
    } else if (route.url.includes('/chatgpt-cn/')) {
      categories['ChatGPT 国内使用'].push(route)
    } else if (route.url.includes('/blog/chatgpt')) {
      categories['ChatGPT 博客'].push(route)
    } else if (route.url.includes('/ai/chatgpt/')) {
      categories['AI 工具'].push(route)
    } else if (route.url.includes('/chatgpt/')) {
      categories['ChatGPT 使用指南'].push(route)
    } else if (route.url.includes('/guides/deepseek/')) {
      categories['DeepSeek 指南'].push(route)
    } else if (route.url.includes('/guides/gemini/')) {
      categories['Gemini 指南'].push(route)
    } else if (route.url.includes('/guides/chatgpt-dev/')) {
      categories['OpenAI 开发'].push(route)
    } else if (route.url.includes('/blog/writing/')) {
      categories['写作指南'].push(route)
    } else if (route.url.includes('/guides/') || route.url.includes('/blog/')) {
      categories['ChatGPT 博客'].push(route)
    } else {
      categories['其他'].push(route)
    }
  }
  
  // 过滤掉空分类，并转换为所需格式
  return Object.entries(categories)
    .filter(([_, links]) => links.length > 0)
    .map(([title, links]) => ({ title, links }))
}

