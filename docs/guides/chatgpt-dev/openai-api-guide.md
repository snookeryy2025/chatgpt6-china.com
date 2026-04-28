---
title: OpenAI ChatGPT API 开发指南 (2025最新版)
description: 全面介绍OpenAI API的接入流程、核心模型(GPT-4o/o1)、Chat Completions接口使用方法及开发最佳实践。
date: 2025-01-03
---

# OpenAI ChatGPT API 开发指南

OpenAI API 允许开发者将强大的大型语言模型（LLM）集成到自己的应用程序、产品和服务中。本指南将帮助你从零开始掌握 ChatGPT 系列 API 的开发。

> **官方文档**: [https://platform.openai.com/docs](https://platform.openai.com/docs)  
> **API 参考**: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)

## 1. 准备工作

在开始编码之前，你需要完成以下步骤：

1.  **注册账号**: 访问 [OpenAI Platform](https://platform.openai.com/) 并注册账号。
2.  **获取 API Key**: 进入 [API Keys](https://platform.openai.com/api-keys) 页面，点击 "Create new secret key"。
    *   *注意*: 生成的 Key 只会显示一次，请务必妥善保存。
3.  **绑定支付方式**: 为了使用 API，通常需要绑定国际信用卡并预充值（Credit Balance）。

## 2. 核心模型介绍

OpenAI 提供了一系列不同能力和价格的模型：

| 模型系列 | 主要模型 | 特点 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **GPT-4o** | `gpt-4o` | **旗舰全能**，速度极快，原生支持多模态（文本/音频/图像），价格比 GPT-4 Turbo 更低。 | 复杂任务、视觉分析、实时交互、多语言翻译。 |
| **GPT-4o mini** | `gpt-4o-mini` | **高性价比**，取代了 GPT-3.5 Turbo。速度快，成本极低。 | 简单对话、摘要、分类、大批量数据处理。 |
| **o1 系列** | `o1-preview`, `o1-mini` | **推理模型**，在回答前会进行"思考"（Chain of Thought）。 | 科学计算、复杂编码、数学证明、逻辑推理。 |
| **GPT-4 Turbo** | `gpt-4-turbo` | 上一代旗舰，支持 128k 上下文。 | 仍需使用旧版行为的场景。 |

## 3. 开发环境配置

OpenAI 官方提供了 Python 和 Node.js 的 SDK库。

### Python 安装

```bash
pip install openai
```

### Node.js 安装

```bash
npm install openai
```

## 4. 快速开始：Chat Completions API

这是最常用的接口，用于实现对话功能。

### Python 示例

```python
from openai import OpenAI
import os

# 建议将 API Key 放入环境变量中
# export OPENAI_API_KEY='sk-...'
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个乐于助人的编程助手。"},
        {"role": "user", "content": "请用Python写一个二分查找算法。"}
    ],
    temperature=0.7,
)

print(response.choices[0].message.content)
```

### Node.js 示例

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "你是一个专业的翻译官。" },
            { role: "user", content: "Hello, how are you today?" }
        ],
        model: "gpt-4o-mini",
    });

    console.log(completion.choices[0].message.content);
}

main();
```

## 5. 核心概念详解

### 消息角色 (Roles)
- **System (系统)**: 设定 AI 的行为模式、人设或上下文限制（例如："你是一个严谨的律师"）。
- **User (用户)**: 终端用户输入的内容。
- **Assistant (助手)**: AI 之前的回复内容，用于保持对话上下文历史。

### 重要参数
- **model**: 指定使用的模型 ID（如 `gpt-4o`）。
- **temperature**: (0.0 - 2.0) 控制输出的随机性。数值越低越确定（适合代码/数学），数值越高越有创意（适合写作）。
- **max_tokens**: 限制生成的最大 token 数量。
- **stream**: (Boolean) 是否开启流式输出，像 ChatGPT 网页版那样逐字显示。

## 6. 进阶功能

### 结构化输出 (Structured Outputs)
强制模型输出符合特定 JSON Schema 的数据，非常适合数据提取任务。

```python
# 伪代码示例：要求模型返回 JSON
response = client.chat.completions.create(
    model="gpt-4o-2024-08-06",
    messages=[...],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "weather_response",
            "schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "temperature": {"type": "number"}
                },
                "required": ["location", "temperature"],
                "additionalProperties": False
            },
            "strict": True
        }
    }
)
```

### 视觉能力 (Vision)
GPT-4o 和 GPT-4 Turbo 具有视觉能力，可以解析图片内容。

```python
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "这张图里有什么？"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
      ],
    }
  ],
)
```

### 文本向量化 (Embeddings)
Embeddings 将文本转换为浮点数列表（向量），用于测量文本字符串之间的关联性。常用于搜索、聚类、推荐及 RAG（检索增强生成）场景。

```python
response = client.embeddings.create(
    input="机器学习是人工智能的一个子集",
    model="text-embedding-3-small"
)
print(response.data[0].embedding)
```

### 语音转文字 (Speech to Text)
使用 Whisper 模型将音频文件转录为文本。

```python
audio_file = open("speech.mp3", "rb")
transcription = client.audio.transcriptions.create(
  model="whisper-1", 
  file=audio_file
)
print(transcription.text)
```

### 图像生成 (Image Generation)
使用 DALL·E 3 模型根据文本描述生成图像。

```python
response = client.images.generate(
  model="dall-e-3",
  prompt="一只在火星上骑自行车的猫, 赛博朋克风格",
  n=1,
  size="1024x1024"
)
image_url = response.data[0].url
```

## 7. 更多能力概览

### Assistants API
Assistants API 允许你构建能够执行特定任务的 AI 助手。这些助手可以利用模型、工具（如代码解释器 Code Interpreter、文件搜索 File Search）和知识库来回答用户查询。它支持自动管理对话历史（Threads），简化了开发流程。

### 微调 (Fine-tuning)
通过在特定数据集上训练模型，可以定制模型的行为，使其更适合特定应用场景。Fine-tuning 可以提高模型在特定任务上的准确性，甚至可能降低延迟和成本（通过使用更小的模型达到类似效果）。

## 8. 最新模型特性 (New Models Features)

### o1 系列 (OpenAI o1)
`o1` 是 OpenAI 最新的推理模型系列，能够在回答前花时间“思考”，从而在科学、代码和数学等复杂任务上表现出色。

*   **o1-preview**: 早期预览版，具有强大的推理能力。
*   **o1-mini**: 更快、更便宜的推理模型，专注于代码和数学。

#### 开发差异与限制 (Beta)
与 GPT-4o 相比，使用 o1 系列有以下主要区别：
1.  **Thinking Process**: 模型在生成最终答案前会产生不可见的“推理 token”。这些 token 计费但不通过 API 返回。
2.  **System Role 限制**: 目前 `o1-preview` 和 `o1-mini` 暂时不支持 `system` 角色，建议将指令放入 `user` 消息中。
3.  **参数变化**:
    *   不支持 `temperature` (默认为 1)。
    *   使用 `max_completion_tokens` 替代 `max_tokens` 来控制生成的总 token 数（包含推理 token 和可见输出）。
4.  **不支持流式输出 (Streaming)**: 目前必须等待整个响应生成完毕。

```python
response = client.chat.completions.create(
    model="o1-preview",
    messages=[
        {
            "role": "user", 
            "content": "编写一个Python脚本，利用蒙特卡洛方法模拟三体运动，并解释其中的物理原理。"
        }
    ],
    max_completion_tokens=5000
)
print(response.choices[0].message.content)
```

### Realtime API (Beta)
Realtime API 是 GPT-4o 的一项新能力，支持低延迟的“语音到语音”交互。它通过 WebSocket 协议连接，允许流式传输音频输入和输出，并支持中断（打断）功能，体验接近人类自然对话。

*   **适用场景**: 语音助手、实时翻译、客服机器人。
*   **主要特点**: 原生语音处理（不再需要 Speech-to-Text -> LLM -> Text-to-Speech 的三步转换），保留情感和语调。
*   **接入方式**: 需使用 WebSocket 连接到 `wss://api.openai.com/v1/realtime`。

> 注意：Realtime API 目前处于 Beta 阶段，费率较高且需要复杂的 WebSocket 状态管理。建议参考官方提供的 Reference Client 进行开发。

## 9. 最佳实践与注意事项

1.  **API Key 安全**: 永远不要将 API Key 硬编码在前端代码或公开的 GitHub 仓库中。始终在后端服务器发起请求。
2.  **错误处理**: 要处理 API 可能抛出的异常，如 `RateLimitError` (速率限制) 或 `APIConnectionError`。
3.  **Token 管理**: 输入和输出都计费。使用 `tiktoken` 库预估 Token 消耗。
4.  **国内访问**: 由于网络原因，国内服务器访问 OpenAI API 可能需要配置代理。
    ```python
    # 示例：在 Python 中配置 Base URL (如使用中转服务)
    client = OpenAI(
        api_key="your-key",
        base_url="https://api.your-proxy-domain.com/v1"
    )
    ```

## 10. 常见资源
*   [OpenAI Cookbook (官方示例集)](https://github.com/openai/openai-cookbook)
*   [Pricing (价格表)](https://openai.com/api/pricing/)
*   [Playground (在线调试台)](https://platform.openai.com/playground)

