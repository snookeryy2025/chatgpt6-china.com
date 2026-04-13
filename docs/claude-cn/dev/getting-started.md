---
title: Claude 开发快速入门
description: 从零开始学习如何使用 Claude API，包含 Python、TypeScript 和 cURL 的完整代码示例。
---

# Claude 开发快速入门

本指南将帮助您快速完成 Claude API 的首次调用，并构建一个简单的 AI 应用。无论您是经验丰富的开发者，还是刚刚接触 AI 开发，Claude 简洁的 API 设计都能让您轻松上手。

> **💡 推荐使用工具：**
> - **Gemini/GPT 聚合站**：[https://ai.lanjingchat.com](https://ai.lanjingchat.com) (支持多模型切换)
> - **AI 镜像站直达**：[https://lazymanchat.com](https://lazymanchat.com) (高速稳定)
> - **AI 中文版入口**：[https://huoyachat.com](https://huoyachat.com)
> - **备用镜像节点**：[https://gptokk.com](https://gptokk.com)

## 1. 前置准备

在开始编写代码之前，您需要完成以下准备工作：

1.  **注册账号**：访问 [Anthropic Console](https://console.anthropic.com/) 并注册一个开发者账号。
2.  **获取 API Key**：在控制台的设置页面生成您的 API 密钥 (`sk-ant-...`)。请妥善保管此密钥，不要在客户端代码中直接暴露。
3.  **环境配置**：确保您的开发环境中已安装 Python (3.7+) 或 Node.js。

## 2. 发送您的第一个 API 请求

Claude 提供了官方的 Python 和 TypeScript SDK，同时也支持标准的 HTTP 请求。

### 选项 A: 使用 Python SDK

首先，安装官方库：

```bash
pip install anthropic
```

创建一个名为 `claude_quickstart.py` 的文件，并写入以下代码：

```python
import anthropic

# 初始化客户端
client = anthropic.Anthropic(
    # 建议将 API KEY 存储在环境变量 ANTHROPIC_API_KEY 中
    # api_key="my_api_key",
)

message = client.messages.create(
    model="claude-3-5-sonnet-20240620",
    max_tokens=1000,
    temperature=0,
    system="你是一位资深的 AI 开发助手，请用简洁的中文回答问题。",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "你好，Claude！请介绍一下你自己。"
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

### 选项 B: 使用 TypeScript SDK

首先，安装官方库：

```bash
npm install @anthropic-ai/sdk
```

创建一个名为 `claude_quickstart.ts` 的文件：

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // 默认从环境变量读取
});

async function main() {
  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: '你好，Claude！请介绍一下你自己。' }],
    model: 'claude-3-5-sonnet-20240620',
  });

  console.log(message.content);
}

main();
```

### 选项 C: 使用 cURL (命令行)

如果您想快速测试接口连通性，可以使用 cURL：

```bash
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-3-5-sonnet-20240620",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "你好，Claude！"}
    ]
}'
```

## 3. 理解 API 响应

Claude 的响应结构非常清晰。以下是一个典型的 JSON 响应示例：

```json
{
  "id": "msg_01...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "你好！我是 Claude，由 Anthropic 开发的人工智能助手..."
    }
  ],
  "model": "claude-3-5-sonnet-20240620",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 15,
    "output_tokens": 28
  }
}
```

-   **id**: 消息的唯一标识符。
-   **content**: 包含实际回复内容的数组。
-   **usage**: Token 使用量统计，用于计算成本。

## 4. 下一步

恭喜！您已经成功完成了第一次 Claude API 调用。接下来，您可以深入了解以下内容：

-   [**模型详解**](./models.md): 了解不同模型的性能与价格。
-   [**核心能力**](./capabilities.md): 学习如何利用视觉与长上下文功能。
