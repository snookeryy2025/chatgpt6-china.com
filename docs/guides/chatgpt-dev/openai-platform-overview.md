---
title: OpenAI Platform 开发文档概览
description: OpenAI 官方开发平台文档概览中文版，涵盖文本生成、Assistants API、Embeddings、语音与图像生成等核心能力。
---

# OpenAI Platform 开发文档概览

本文档基于 [OpenAI Platform 官方文档](https://platform.openai.com/docs/overview) 整理与翻译，旨在帮助开发者快速了解 OpenAI API 的核心能力与使用方式。

> **提示**：官方文档更新频繁，建议以[英文官网](https://platform.openai.com/docs/overview)为准，本文仅供参考。

## 简介 (Introduction)

OpenAI API 提供了一系列强大的人工智能模型，开发者可以通过简单的 HTTP 请求将这些能力集成到自己的应用中。主要能力包括：

- **文本生成 (Text Generation)**: 用于对话、内容创作、摘要等。
- **助手 (Assistants)**: 构建能够使用工具（如代码解释器、文件搜索）的智能助手。
- **嵌入 (Embeddings)**: 将文本转化为向量，用于搜索、聚类和推荐。
- **语音 (Speech)**: 包括语音转文本 (Whisper) 和文本转语音 (TTS)。
- **图像 (Image)**: 生成和编辑图像 (DALL·E) 以及理解图像内容 (Vision)。

---

## 快速开始 (Get started)

要开始使用 OpenAI API，通常需要以下步骤：

1.  **创建账号**: 注册 OpenAI Platform 账号。
2.  **API Keys**: 在 Dashboard 中创建 API Key 用于身份验证。
3.  **SDK 安装**: 官方提供 Python 和 Node.js SDK，同时也支持社区维护的其他语言库。

```bash
# 安装 Python SDK
pip install openai

# 安装 Node.js SDK
npm install openai
```

4.  **发送第一个请求**:

```python
from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": "你是一个有用的助手。"},
    {"role": "user", "content": "你好，请介绍一下你自己。"}
  ]
)

print(completion.choices[0].message.content)
```

---

## 核心能力 (Capabilities)

### 1. 文本生成 (Text Generation)
OpenAI 的旗舰模型（如 **GPT-4o**, **GPT-4 Turbo**）可以理解并生成自然语言和代码。
- **Chat Completions API**: 最常用的接口，支持多轮对话、单次指令遵循。
- **JSON Mode**: 强制模型输出有效的 JSON 格式。
- **Function Calling**: 让模型根据描述智能地调用外部函数或 API。

### 2. Assistants API
构建拥有持久记忆和工具使用能力的 AI 助手。
- **Code Interpreter**: 在沙箱环境中编写和运行 Python 代码，处理数据、生成图表。
- **File Search**: 上传文档，让助手基于文档内容回答问题（RAG）。
- **Threads**: 自动管理对话历史，无需每次请求都发送完整的上下文。

### 3. 嵌入 (Embeddings)
Embeddings API 将文本转换为数字向量（vector）。
- **用途**: 语义搜索、聚类、分类、推荐系统。
- **模型**: `text-embedding-3-small` 和 `text-embedding-3-large`。

### 4. 视觉 (Vision)
**GPT-4o** 和 **GPT-4 Turbo with Vision** 具备视觉能力，可以理解并分析上传的图片。
- **功能**: 图片说明、物体识别、OCR（文字识别）、图表分析。

### 5. 图像生成 (Image Generation)
基于 **DALL·E 3** 模型。
- **功能**: 根据文本提示生成高质量图像、编辑图像。

### 6. 语音 (Speech)
- **TTS (Text-to-Speech)**: 将文本转换为逼真的语音，提供多种音色（Alloy, Echo, Fable, Onyx, Nova, Shimmer）。
- **Whisper**: 强大的语音转文本模型，支持多种语言的识别与翻译。

### 7. 微调 (Fine-tuning)
通过在特定数据集上通过训练来定制模型，以提高特定任务的表现或遵循特定的风格。
- 支持模型: GPT-4o, GPT-3.5 Turbo 等。

---

## 模型概览 (Models)

| 模型系列 | 描述 |
| :--- | :--- |
| **GPT-4o** | 这里的 "o" 代表 "omni"。最新的旗舰模型，具备原生的多模态能力（文本、音频、图像），速度更快，成本更低。 |
| **o1 系列** | 新一代推理模型（o1-preview, o1-mini），在处理复杂数学、编程和科学问题时表现出色，会在回答前进行深入思考。 |
| **GPT-4 Turbo** | 之前的高性能模型，具备长上下文窗口（128k）。 |
| **GPT-3.5 Turbo** | 性价比极高的模型，适合简单任务和快速响应。 |
| **DALL·E** | 图像生成模型。 |
| **Whisper** | 语音识别模型。 |
| **TTS** | 文本转语音模型。 |
| **Embeddings** | 文本向量化模型。 |

---

## API 参考 (API Reference)

API 参考文档提供了每个端点（Endpoint）的详细参数说明、请求示例和响应结构。
- **Base URL**: `https://api.openai.com/v1`
- **Authentication**: Bearer Token 方式 (`Authorization: Bearer $OPENAI_API_KEY`)

更多详细信息，请访问 [OpenAI API Reference](https://platform.openai.com/docs/api-reference)。

