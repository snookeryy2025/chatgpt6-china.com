---
title: Gemini API 申请与开发指南 - Google AI Studio 教程
description: 想要调用Gemini API开发应用？本文提供Google Gemini API Key申请教程，Python SDK调用示例，以及免费额度与计费说明。
head:
  - - meta
    - name: keywords
      content: Gemini API,Gemini API Key,Google AI Studio,Gemini SDK,Gemini开发教程,Gemini API价格
---

# Gemini API 申请与开发指南 (2026)

Google 提供了非常友好的 **Gemini API**，允许开发者将 Gemini 3 的强大能力集成到自己的应用中。无论你是构建聊天机器人、文档分析工具还是多模态应用，Gemini API 都是目前性价比极高的选择。

## 🛠️ Google AI Studio vs Vertex AI

在开始之前，你需要知道 Google 提供了两个主要的开发平台：

1.  **Google AI Studio** (推荐个人开发者)
    *   **特点**：快速上手，获取 API Key 简单，提供免费层级。
    *   **适用**：个人项目、原型开发、中小规模应用。
    *   **入口**：[aistudio.google.com](https://aistudio.google.com)

2.  **Vertex AI (Google Cloud)** (推荐企业)
    *   **特点**：企业级安全、数据合规、无需排队、支持微调。
    *   **适用**：商业生产环境、大规模并发、需要 SLA 保障。
    *   **入口**：Google Cloud Console

本文主要介绍如何使用 **Google AI Studio**。

## 🔑 第一步：获取 API Key

1.  **准备账号**：你需要一个 Google 账号。
2.  **访问平台**：进入 [Google AI Studio](https://aistudio.google.com/)。
3.  **接受条款**：首次登录需要同意使用条款。
4.  **创建密钥**：
    *   点击左侧边栏的 **"Get API key"**。
    *   点击 **"Create API key in new project"**。
    *   复制生成的 API Key，妥善保存（不要泄露给他人）。

> ⚠️ **注意**：目前 API 服务可能对部分地区（如中国内地）IP 进行了限制，申请和调用时请确保网络环境符合要求，或使用 API 转发服务。

## 💻 第二步：Python SDK 快速上手

Google 官方提供了 `google-generativeai` Python 库，使用非常简单。

### 1. 安装库
```bash
pip install -q -U google-generativeai
```

### 2. 编写代码
创建一个 `demo.py` 文件：

```python
import google.generativeai as genai
import os

# 配置 API Key
genai.configure(api_key="YOUR_API_KEY")

# 选择模型 (Gemini 3 Pro)
model = genai.GenerativeModel('gemini-1.5-pro-latest') # 注意：具体模型名称请以官方文档为准，Gemini 3 发布后会更新

# 1. 简单文本对话
response = model.generate_content("请用一句话解释量子纠缠。")
print(f"回答: {response.text}")

# 2. 多模态理解 (假设目录下有一张 image.jpg)
# import PIL.Image
# img = PIL.Image.open('image.jpg')
# response = model.generate_content(["这张图片里有什么？", img])
# print(response.text)
```

### 3. 流式传输 (Streaming)
```python
response = model.generate_content("写一篇关于人工智能未来的短篇科幻小说", stream=True)
for chunk in response:
    print(chunk.text, end="", flush=True)
```

## 💰 价格与免费额度 (Gemini API Pricing)

Google AI Studio 目前的定价策略非常激进：

### 免费层 (Free of Charge)
*   **适用模型**：Gemini 1.5 Flash, Gemini 1.5 Pro (含 3.0 预览版)
*   **限制**：
    *   **速率限制**：每分钟请求数 (RPM) 有限制（例如 15 RPM）。
    *   **数据使用**：Google 可能会使用免费层的输入/输出数据来改进模型（**请勿上传敏感隐私数据**）。

### 付费层 (Pay-as-you-go)
*   **特点**：更高的速率限制，数据仅用于响应请求，**不用于训练**。
*   **价格参考** (以 Flash 模型为例，价格极低)：
    *   输入：$0.075 / 1百万 Tokens (128k context)
    *   输出：$0.30 / 1百万 Tokens

*注：具体价格请以官网实时数据为准。*

## 🛡️ 安全设置 (Safety Settings)

Gemini API 默认开启了安全过滤器。你可以通过代码调整敏感度：

```python
safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE" # 慎用，允许所有内容
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  }
]

response = model.generate_content("...", safety_settings=safety_settings)
```

## 🚀 进阶资源

*   **API 文档**: [ai.google.dev](https://ai.google.dev/docs)
*   **Prompt 库**: [Gemini Prompt Gallery](https://ai.google.dev/examples)

---
*开始你的 Gemini 开发之旅吧！*

