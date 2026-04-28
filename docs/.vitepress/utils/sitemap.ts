import { execSync } from 'child_process'
import { existsSync, statSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import { getAllRoutes, getRoutesByCategory } from './routes'

// 从中心化配置获取所有路由
const links = getAllRoutes().map(route => ({
  url: route.url,
  changefreq: route.changefreq || 'weekly',
  priority: route.priority || 0.5
}))

function getLastModified(url: string): string | undefined {
  // 转换 url 到文件路径
  // 假设项目根目录是 process.cwd()，docs 目录在 docs/
  let filePath = url.replace(/^\//, '')
  if (filePath === '' || filePath.endsWith('/')) {
    filePath += 'index.md'
  } else if (filePath.endsWith('.html')) {
    filePath = filePath.replace(/\.html$/, '.md')
  }
  
  const fullPath = resolve(process.cwd(), 'docs', filePath)
  
  if (!existsSync(fullPath)) {
    // console.warn(`File not found for sitemap lastmod: ${fullPath}`)
    return undefined
  }

  try {
    // 使用 git log 获取最后修改时间
    const dateStr = execSync(`git log -1 --format=%cI "${fullPath}"`, { encoding: 'utf-8' }).trim()
    if (dateStr) return dateStr
  } catch (e) {
    // git command failed, fallback to file mtime
  }
  
  try {
    return statSync(fullPath).mtime.toISOString()
  } catch (e) {
    return undefined
  }
}

// 生成 XML 格式的 sitemap
async function generateXmlSitemap(hostname: string, outDir: string) {
  try {
    const stream = new SitemapStream({ hostname })
    const linksWithLastMod = links.map(link => {
      //const lastmod = getLastModified(link.url)
      const lastmod = new Date().toISOString()
      return lastmod ? { ...link, lastmod } : link
    })

    const data = await streamToPromise(
      Readable.from(linksWithLastMod).pipe(stream)
    )
    writeFileSync(resolve(outDir, 'sitemap.xml'), data.toString())
    console.log('✅ XML Sitemap generated successfully!')
  } catch (error) {
    console.error('❌ Error generating XML sitemap:', error)
  }
}

// 生成 TXT 格式的 sitemap
function generateTxtSitemap(hostname: string, outDir: string) {
  try {
    const allRoutes = getAllRoutes()
    const urls = allRoutes.map(route => `${hostname}${route.url}`).join('\n')

    writeFileSync(resolve(outDir, 'sitemap.txt'), urls)
    console.log('✅ TXT Sitemap generated successfully!')
  } catch (error) {
    console.error('❌ Error generating TXT sitemap:', error)
  }
}

// 生成 HTML 格式的 sitemap
function generateHtmlSitemap(hostname: string, outDir: string) {
  try {
    // 从中心化配置获取分类后的路由
    const pages = getRoutesByCategory().map(category => ({
      title: category.title,
      links: category.links.map(route => ({
        url: route.url,
        name: route.title
      }))
    }))

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网站地图 - ChatGPT中文版</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        h1 { 
            color: #2563eb;
            text-align: center;
            margin-bottom: 2rem;
        }
        h2 {
            color: #1d4ed8;
            margin-top: 2rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
        }
        .sitemap-section {
            margin-bottom: 2rem;
        }
        .sitemap-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
        }
        .sitemap-item {
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        .sitemap-item:hover {
            background: #f8fafc;
            border-color: #2563eb;
        }
        .sitemap-link {
            color: #1a1a1a;
            text-decoration: none;
            display: block;
        }
        .sitemap-link:hover {
            color: #2563eb;
        }
        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }
            .sitemap-list {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <h1>ChatGPT中文版 - 网站地图</h1>
    ${pages.map(section => `
        <div class="sitemap-section">
            <h2>${section.title}</h2>
            <ul class="sitemap-list">
                ${section.links.map(link => `
                    <li class="sitemap-item">
                        <a href="${hostname}${link.url}" class="sitemap-link">
                            ${link.name}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('')}
</body>
</html>`

    writeFileSync(resolve(outDir, 'sitemap.html'), htmlContent)
    console.log('✅ HTML Sitemap generated successfully!')
  } catch (error) {
    console.error('❌ Error generating HTML sitemap:', error)
  }
}

// 生成 robots.txt
function generateRobotsTxt(hostname: string, outDir: string) {
  try {
    const robotsTxt = `User-agent: *
Disallow:

Sitemap: ${hostname}/sitemap.xml
Sitemap: ${hostname}/sitemap.txt
Sitemap: ${hostname}/sitemap.html`

    writeFileSync(resolve(outDir, 'robots.txt'), robotsTxt)
    console.log('✅ Robots.txt generated successfully!')
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error)
  }
}

// 主函数：生成所有格式的 sitemap
export async function generateSitemaps(outDir: string) {
  const hostname = 'https://www.chatgpt6-china.com'
  
  await generateXmlSitemap(hostname, outDir)
  generateTxtSitemap(hostname, outDir)
  generateHtmlSitemap(hostname, outDir)
  generateRobotsTxt(hostname, outDir)
} 