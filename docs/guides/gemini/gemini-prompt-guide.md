---
title: Google Gemini 提示词工程 (Prompt Engineering) 指南 - 让 Gemini 更懂你
description: 掌握Gemini 3的提示词技巧，发挥原生多模态模型的最大潜力。本文分享针对Gemini优化的高效Prompt，涵盖文本生成、代码编写、图像理解等场景。
head:
  - - meta
    - name: keywords
      content: Gemini提示词,Gemini Prompt,Prompt Engineering,Gemini指令,Google Gemini技巧,多模态提示词
---

# Google Gemini 提示词工程指南：让 AI 更懂你

**Gemini 3** 作为原生多模态模型，其理解能力与传统的 GPT-4 有所不同。掌握针对 Gemini 优化的**提示词（Prompt）**技巧，能让你事半功倍，充分挖掘出这个万亿参数怪兽的潜力。

本文将为你揭示 Gemini 独有的 Prompt 秘籍。

## 🧠 核心原则：多模态思维

与纯文本模型不同，Gemini "看"世界的方式更接近人类。

### 1. 善用多模态输入
不要只用文字描述图片，直接**把图片丢给它**！
*   ❌ **差的 Prompt**：写一段代码，实现一个网页布局，顶部是导航栏，左边是菜单...
*   ✅ **好的 Prompt**：[上传一张草图] 请把这张草图转换成 HTML/Tailwind CSS 代码。

### 2. 指定角色与上下文 (Persona & Context)
Gemini 非常擅长角色扮演。
*   **示例**：“你是一位资深 Python 架构师，请审查以下代码的安全性，并给出重构建议。”

### 3. 清晰的思维链 (Chain of Thought)
对于复杂任务，引导 Gemini 一步步思考。
*   **技巧**：在 Prompt 结尾加上“请一步步思考 (Let's think step by step)”或者“请先列出解题思路，再给出答案”。

## 💡 实战场景与 Prompt 模板

### 场景一：文档分析与长文总结
Gemini 3 支持 **200万 Token**，你可以上传整本 PDF。

> **Prompt**:
> "请阅读这份 500 页的技术文档。
> 1. 总结核心架构设计。
> 2. 找出文中提到的所有潜在安全风险。
> 3. 基于文档内容，生成一个 FAQ（常见问题解答）列表，包含 10 个问题和答案。"

### 场景二：多模态创意写作
结合图片激发灵感。

> **Prompt**:
> [上传一张风景照]
> "这是一张我拍摄的照片。请以此为灵感，写一首关于'孤独与希望'的现代诗。诗歌的意境要与画面中的光影相呼应。"

### 场景三：视频内容检索
利用 Gemini 的原生视频理解能力。

> **Prompt**:
> [上传一段 20 分钟的产品发布会视频]
> "在视频的哪个时间点，演讲者提到了'电池续航'？请总结他对续航能力的具体描述，并对比上一代产品的提升数据。"

### 场景四：复杂代码生成

> **Prompt**:
> "你是一位全栈工程师。请使用 Next.js 14 和 Supabase 创建一个待办事项应用。
> 要求：
> 1. 使用 Server Actions 处理数据提交。
> 2. 包含用户登录功能。
> 3. 样式使用 Tailwind CSS。
> 请先给出目录结构，然后提供关键文件的代码。"

## 🚀 Gemini 特有技巧：System Instructions

在 Google AI Studio 中，你可以设置 **System Instructions**（系统指令）。这相当于给 Gemini 植入一个永久的“人设”或“规则”。

**推荐的 System Instruction 设置**：
```text
你是一位乐于助人、专业且客观的 AI 助手。
回答风格：
- 简洁明了，避免废话。
- 使用 Markdown 格式排版。
- 在涉及代码时，优先提供 Python 或 JavaScript 示例。
- 拒绝回答涉及暴力、色情或非法内容的请求。
```

## ⚠️ 常见误区

1.  **过度拟人化**：虽然 Gemini 能模拟人类语气，但不要以为它真的有感情。保持指令清晰客观效果更好。
2.  **忽略温度参数 (Temperature)**：
    *   需要精准答案（如数学、编程）：将 Temperature 设为 `0` 或 `0.2`。
    *   需要创意灵感（如写诗、头脑风暴）：将 Temperature 设为 `0.8` 或 `1.0`。
3.  **单次交互期望过高**：对于极复杂的任务，尝试将大任务拆解为小任务，通过多轮对话完成。

---
*掌握了这些技巧，你已经领先了 90% 的用户。快去 [Gemini 官网](https://gemini.google.com) 试试吧！*

