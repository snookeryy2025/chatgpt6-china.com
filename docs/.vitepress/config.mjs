import { defineConfig } from 'vitepress'
import { generateSidebarConfig } from './utils/routes'
import { generateSitemaps } from './utils/sitemap'

export default defineConfig({
  title: 'ChatGPT 中文版',
  description: 'ChatGPT官网入口、国内使用指南、最新资讯 - 中国用户首选的ChatGPT中文资源站',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#10a37f' }],
    ['meta', { name: 'baidu-site-verification', content: 'your-baidu-verification-code' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'ChatGPT 6 RSS', href: '/rss.xml' }],
    ['link', { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }],

    // Article Schema
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'ChatGPT 使用教程：OpenAI GPT-6 国内使用指南',
      'description': '提供 ChatGPT 官方网址登录入口与国内可用的中文版使用教程，覆盖 GPT-4、GPT-4o、o1 与 GPT-5 的实用指南。含镜像网站推荐、注册官网全流程、常见问题与安全建议，帮助国内用户无障碍使用 ChatGPT。',
      'author': {
        '@type': 'Organization',
        'name': 'ChatGPT使用教程',
        'url': 'https://www.chatgpt6-china.com',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'ChatGPT6指南',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.chatgpt6-china.com/logo.svg',
        },
      },
      'datePublished': '2026-04-13',
      'dateModified': new Date().toISOString().split('T')[0],
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': 'https://www.chatgpt6-china.com/',
      },
      'keywords': 'ChatGPT, GPT-4, GPT-4o, GPT-5, OpenAI, AI聊天, 国内ChatGPT, ChatGPT镜像',
    })],

    // FAQ Schema
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': '国内用户如何使用 ChatGPT？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '由于 OpenAI 官方服务在国内存在访问限制，国内用户可以通过以下方式使用 ChatGPT：1. 使用本文推荐的国内镜像站，无需翻墙，直接访问；2. 通过第三方平台（如 Lazyman、Xsimple）提供的聚合接口；3. 使用支持 OpenAI API 的国内 AI 产品。',
          },
        },
        {
          '@type': 'Question',
          'name': 'ChatGPT 免费吗？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'OpenAI 提供免费版 ChatGPT（基于 GPT-3.5），但功能和次数有限。GPT-4、GPT-4o 等更强大的模型需要订阅 ChatGPT Plus（每月 20 美元）。国内镜像站通常提供免费试用额度。',
          },
        },
        {
          '@type': 'Question',
          'name': 'ChatGPT 和 GPT 的区别是什么？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ChatGPT 是基于 GPT 模型开发的对话产品，GPT（Generative Pre-trained Transformer）是底层语言模型技术。ChatGPT 通过对话界面让用户更方便地使用 GPT 的能力。',
          },
        },
        {
          '@type': 'Question',
          'name': '使用 ChatGPT 安全吗？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '使用 ChatGPT 时需注意：不要输入个人隐私信息、密码或敏感数据；AI 生成内容仅供参考，请自行核实重要信息；选择正规渠道访问，避免钓鱼网站。',
          },
        },
        {
          '@type': 'Question',
          'name': 'ChatGPT Plus 和免费版有什么区别？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '免费版基于 GPT-3.5，有速度较慢、功能有限、高峰期限制等不足。Plus 版基于 GPT-4o/GPT-4，速度更快、支持图片理解、语音对话、无限使用。',
          },
        },
      ],
    })],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ChatGPT使用教程',

    nav: [
      { text: '首页', link: '/' },
      { text: 'ChatGPT指南', link: '/guides/' },
      { text: 'GPT模型', link: '/models/gpt-models' },
      { text: '国内使用', link: '/usage/domestic-usage' },
      { text: '关于', link: '/about' },
    ],
    sidebar: generateSidebarConfig(),
    /* sidebar: {
      '/ai-tools/': [
        {
          text: 'ChatGPT指南',
          items: [
            { text: 'ChatGPT官网入口', link: '/ai-tools/chatgpt-guide' },
            { text: 'ChatGPT注册教程', link: '/ai-tools/chatgpt-register' },
            { text: 'ChatGPT Plus订阅', link: '/ai-tools/chatgpt-plus' },
          ],
        },
      ],
      '/models/': [
        {
          text: 'GPT模型',
          items: [
            { text: 'GPT-5最新动态', link: '/models/gpt-models' },
            { text: 'GPT-4o深度评测', link: '/models/gpt4o-review' },
            { text: 'GPT-4对比GPT-3.5', link: '/models/gpt4-vs-gpt35' },
          ],
        },
      ],
      '/usage/': [
        {
          text: '国内使用',
          items: [
            { text: '国内访问指南', link: '/usage/domestic-usage' },
            { text: '国内镜像站推荐', link: '/usage/mirror-sites' },
            { text: '常见问题FAQ', link: '/usage/faq' },
          ],
        },
      ],
    }, */

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: `© ${new Date().getFullYear()} ChatGPT 6 - 让AI触手可及`,
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: false,
  },

  /* sitemap: {
    hostname: 'https://www.chatgpt6-china.com',
    lastmod: 'date',
  }, */
  buildEnd: async ({ outDir }) => {
    // 生成 sitemap
    await generateSitemaps(outDir)
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
})
