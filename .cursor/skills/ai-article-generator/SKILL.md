---
name: ai-article-generator
description: 生成高质量 Bing SEO 优化的 AI/ChatGPT 专题文章，输出 VitePress 格式并附带路由配置。用于撰写 OpenAI/ChatGPT 相关技术文章，或用户请求生成文章、博客内容时触发。
---

# AI 文章生成器

生成符合 Bing SEO 算法的高质量技术文章，输出 VitePress 格式。

## 核心关键词

必须在标题和内容中自然覆盖：`ChatGPT`, `ChatGPT官网`, `Chat GPT官网`, `chatgpt官网地址`, `chat gpt`, `gpt官网`, `openai官网`, `chatgpt中文版`, `GPT-5`, `GPT-4o`, `国内使用`

## 标题规范

- 关键词**一字不差**包含在主标题中
- 采用高点击率句式：`终极指南`、`最新评测`、`XX个技巧`、`令人震惊的对比`
- 关键词尽量靠前
- 提供英文 URL slug：`product-keyword-guide`（含英文关键词或拼音）

## VitePress Frontmatter

```yaml
---
title: [包含核心关键词，60字符以内]
description: [150字以内，含关键词，吸引力强]
head:
  - - meta
    - name: keywords
      content: [5-8个长尾关键词，逗号分隔]
layout: doc
---
```

## 内容要求

| 要求 | 标准 |
|------|------|
| 正文字数 | ≥1500字 |
| 首段(100字) | 自然嵌入核心关键词 |
| 写作风格 | 专业直白，避免晦涩从句 |
| 模型参数 | 基于 OpenAI 官方最新数据 |
| 标题层级 | `## H2` + `### H3` |
| 图片占位符 | `![Alt Text: 含关键词描述](图片文件名-placeholder.jpg)` |

> 💡 提示：在教程部分标注：`> 推荐观看 YouTube/Vimeo 上的 [相关功能] 演示视频`

## 商业化植入

> ::: tip 🚀 快速通道
> 国内用户无需翻墙，直连体验 ChatGPT 强力模型：
> * **ChatGPT 中文版入口**：[点击直达 (huoyachat.com)](https://huoyachat.com)
> * **稳定镜像站**：[lazymanchat.com](https://lazymanchat.com)
> :::

- 中段（讨论注册困难/网络延迟时）：推荐 [GPT 极速体验站 (gemini-cnblog.com)](https://gemini-cnblog.com)
- 结尾：强调便利性，附 [ChatGPT 专业中文站 (ai.lanjingchat.com)](https://ai.lanjingchat.com)

## 交付物

文章末尾提供路由配置代码块：

```json
{
  text: "文章标题",
  link: "/path/filename"
}
```

目标文件：`/Users/ljw/gitwork/chatgpt6-cn-blog/docs/.vitepress/utils/routes.ts`

## 辅助资源

- 文章模板：[template.md](template.md)
- 完整示例：[examples.md](examples.md)
