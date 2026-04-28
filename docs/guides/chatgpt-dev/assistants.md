---
title: Assistants API 开发指南
description: 学习如何使用 OpenAI Assistants API 构建拥有持久记忆、代码解释器和文件搜索能力的智能体 (Agents)。
---

# Assistants API

Assistants API 允许开发者在自己的应用中构建强大的 AI 助手。这些助手拥有指令 (Instructions)，可以利用模型、工具 (Tools) 和知识库 (Knowledge) 来响应用户查询。

目前的 Assistants API 支持三种类型的工具：
1.  **Code Interpreter (代码解释器)**
2.  **File Search (文件搜索)**
3.  **Function Calling (函数调用)**

## 核心概念

Assistants API 基于以下几个核心对象：

1.  **Assistant (助手)**: 定义了助手的配置，包括使用的模型 (如 `gpt-4o`)、指令、工具和相关文件。
2.  **Thread (线程)**: 代表助手与用户之间的对话会话。Thread 会自动处理上下文窗口管理，存储消息历史。你无需再手动截断消息来适应 Token 限制。
3.  **Message (消息)**: 由用户或助手创建的消息。消息可以包含文本、图片或其他文件。
4.  **Run (运行)**: 激活助手在某个 Thread 上开始运行。助手会查看 Thread 中的内容，调用工具，并将响应追加到 Thread 中。
5.  **Run Step (运行步骤)**: Run 的详细执行步骤，用于通过代码或检索工具查看助手的内部操作。

## 快速实现流程

### 1. 创建 Assistant

```python
assistant = client.beta.assistants.create(
  name="Math Tutor",
  instructions="You are a personal math tutor. Write and run code to answer math questions.",
  tools=[{"type": "code_interpreter"}],
  model="gpt-4o",
)
```

### 2. 创建 Thread

```python
thread = client.beta.threads.create()
```

### 3. 添加消息 (Add Message)

```python
message = client.beta.threads.messages.create(
  thread_id=thread.id,
  role="user",
  content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
)
```

### 4. 运行 Assistant (Run)

```python
run = client.beta.threads.runs.create_and_poll(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="Please address the user as Jane Doe. The user has a premium account."
)

if run.status == 'completed': 
  messages = client.beta.threads.messages.list(
    thread_id=thread.id
  )
  print(messages)
else:
  print(run.status)
```

## 工具详解

### Code Interpreter (代码解释器)
允许助手在沙箱执行环境中编写和运行 Python 代码。
-   **用途**: 解决复杂的数学问题、生成图表、处理上传的数据文件 (CSV, PDF 等)。
-   **计费**: 按会话数计费。

### File Search (文件搜索/RAG)
允许助手读取并在其响应中引用文件内容。
-   **机制**: OpenAI 自动将文档分块、嵌入并存储在向量数据库中，并根据用户查询进行检索 (RAG - Retrieval Augmented Generation)。
-   **支持格式**: PDF, MD, DOCX, TXT 等。

### Function Calling (函数调用)
与其 Chat Completions API 中的运作方式类似，允许你定义自定义函数签名，由助手决定何时调用。

## Streaming (流式输出)

Assistants API 支持流式传输，可以实时将助手的思考过程和回复逐字发送给前端，提供更好的用户体验。

```python
# 使用 EventHandler 处理流式事件
from typing_extensions import override
from openai import AssistantEventHandler

class EventHandler(AssistantEventHandler):    
  @override
  def on_text_created(self, text) -> None:
    print(f"\nassistant > ", end="", flush=True)
      
  @override
  def on_text_delta(self, delta, snapshot):
    print(delta.value, end="", flush=True)

with client.beta.threads.runs.stream(
  thread_id=thread.id,
  assistant_id=assistant.id,
  event_handler=EventHandler(),
) as stream:
  stream.until_done()
```

