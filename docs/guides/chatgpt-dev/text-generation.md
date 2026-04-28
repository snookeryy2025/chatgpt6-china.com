---
title: OpenAI 文本生成指南 (Text Generation)
description: 深入解析 OpenAI Chat Completions API，包括消息角色、JSON 模式、函数调用及参数详解。
---

# 文本生成 (Text Generation)

OpenAI 的文本生成模型（通常称为生成式预训练 Transformer 或 GPT）经过训练，可以理解自然语言、代码和图像。这些模型提供文本输出以响应输入（prompt）。输入到这些模型的“提示”也称为 **Context (上下文)**。

## Chat Completions API

OpenAI 的核心交互接口是 Chat Completions API。虽然通过单一 prompt 看起来像是在“问答”，但该 API 实际上是处理通过消息列表传递的对话历史。

### 基本结构

请求的核心是 `messages` 数组。每个消息对象都有一个 `role` (角色) 和 `content` (内容)。

-   **System (系统)**: 设置助手的行为、角色和上下文。例如：“你是一个乐于助人的客服助手”。
-   **User (用户)**: 用户的提问或指令。
-   **Assistant (助手)**: 模型的回复。通常用于存储历史对话，或由开发者伪造以引导模型行为（Few-shot prompting）。

```python
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
    {"role": "user", "content": "Where was it played?"}
  ]
)
```

### 重要参数

-   **model**: 选择使用的模型 ID (如 `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`)。
-   **frequency_penalty**: (-2.0 到 2.0) 正值会根据新token在文本中出现的频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。
-   **presence_penalty**: (-2.0 到 2.0) 正值会根据新token是否出现在文本中对其进行惩罚，从而增加模型谈论新主题的可能性。
-   **max_tokens**: 限制生成结果的最大 token 数量。
-   **temperature**: (0 到 2) 控制随机性。较高的值 (如 0.8) 使输出更随机，较低的值 (如 0.2) 使其更集中和确定。
-   **top_p**: 核采样 (Nucleus sampling)，作为 temperature 的替代方案。
-   **n**: 为每条输入消息生成的聊天完成选项数量。
-   **stream**: 如果设置为 `True`，将发送部分消息增量（流式传输），就像在 ChatGPT 网页上看到的那样。

## JSON Mode (JSON 模式)

在构建应用时，经常需要模型输出结构化的 JSON 数据。

1.  在 System 消息中明确指示模型输出 JSON（例如 "Please output valid JSON"）。
2.  设置 `response_format={ "type": "json_object" }`。

```python
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Who won the world series in 2020?"}
  ],
  response_format={ "type": "json_object" }
)
print(response.choices[0].message.content)
# 输出: { "winner": "The Los Angeles Dodgers", "year": 2020 } (示例结构)
```

## Function Calling (函数调用)

函数调用允许你向模型描述函数，并让模型智能地选择输出包含调用参数的 JSON 对象。这使得你可以将 GPT 能力与外部工具（API、数据库）连接起来。

**流程：**
1.  **定义工具**: 在请求中通过 `tools` 参数定义你的函数（名称、描述、参数 JSON Schema）。
2.  **模型决策**: 模型判断是否需要调用函数。如果需要，它会返回一个 `tool_calls` 对象，包含函数名和参数。
3.  **执行代码**: 你的代码解析模型的响应，执行实际的函数逻辑。
4.  **返回结果**: 将函数执行结果作为新的 `tool` role 消息传回给模型。
5.  **最终回答**: 模型整合函数结果，生成最终的自然语言回复。

```python
tools = [
  {
    "type": "function",
    "function": {
      "name": "get_current_weather",
      "description": "Get the current weather in a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA",
          },
          "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] },
        },
        "required": ["location"],
      },
    }
  }
]

# ... 在请求中传入 tools=tools ...
```

## Reproducible Outputs (可复现输出)

默认情况下，即使 `temperature=0`，OpenAI 模型也是非确定性的。为了获得（主要是）确定性的输出：
1.  设置 `seed` 参数（整数）。
2.  确保 `system_fingerprint` 在响应中是相同的，这有助于监控后端配置的变化。

## Token 管理

OpenAI 模型通过将文本分解为 token 来处理文本。
-   1 个 token ≈ 0.75 个英文单词。
-   中文 token 计算较为复杂，通常 1 个汉字可能对应 1-2 个 token。
-   输入 token + 输出 token 的总和不能超过模型的上下文窗口限制（Context Window）。

可以使用 [Tiktokenizer](https://tiktokenizer.vercel.app/) 等工具估算 Token 数量。

