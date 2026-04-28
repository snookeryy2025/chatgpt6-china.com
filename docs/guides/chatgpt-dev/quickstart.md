---
title: OpenAI API 快速入门 (Quickstart)
description: OpenAI API 快速接入指南，包括账号设置、环境配置及第一个 API 请求示例。
---

# 快速入门 (Quickstart)

本指南将帮助你设置开发环境并发送你的第一个 OpenAI API 请求。我们将涵盖账号注册、API Key 生成、SDK 安装以及发送一个简单的 Chat Completion 请求。

## 1. 创建账号与 API Key

在开始编码之前，你需要一个 OpenAI 账号和 API Key。

1.  访问 [OpenAI Platform](https://platform.openai.com/) 并注册账号。
2.  登录后，进入 **[Dashboard](https://platform.openai.com/dashboard)**。
3.  在左侧菜单中找到 **API Keys**。
4.  点击 **"Create new secret key"**。
    *   **注意**: 密钥生成后只会显示一次，请立即将其复制并保存在安全的地方（如密码管理器）。
    *   不要直接将 API Key 硬编码在代码仓库中，建议使用环境变量。

## 2. 环境设置

OpenAI 官方提供了 Python 和 Node.js 的 SDK，简化了 API 调用过程。

### Python 环境

**要求**: Python 3.7.1 或更高版本。

```bash
# 创建虚拟环境 (可选但推荐)
python -m venv openai-env
source openai-env/bin/activate  # Mac/Linux
# openai-env\Scripts\activate   # Windows

# 安装 OpenAI Python 库
pip install openai
```

### Node.js 环境

**要求**: Node.js 14.18+ 或 16+。

```bash
# 初始化项目 (如果尚未初始化)
npm init -y

# 安装 OpenAI Node.js 库
npm install openai
```

## 3. 设置 API Key (环境变量)

为了安全起见，建议将 API Key 存储在环境变量中，而不是代码里。

**Mac/Linux (bash/zsh):**
```bash
export OPENAI_API_KEY="sk-proj-..."
```
可以将上述命令添加到你的 `~/.zshrc` 或 `~/.bash_profile` 文件中以便永久生效。

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-proj-..."
```

## 4. 发送第一个请求

现在我们来编写代码，向 GPT-4o 模型发送一个简单的对话请求。

### Python 示例

创建一个名为 `chatgpt_quickstart.py` 的文件：

```python
from openai import OpenAI
import os

# 如果没有设置环境变量，也可以直接在此处传入 api_key 参数
# client = OpenAI(api_key="your-api-key")
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": "你是一位富有诗意的助手，擅长用简洁的语言解释复杂的编程概念。"},
    {"role": "user", "content": "请用一首短诗解释什么是递归。"}
  ]
)

print(completion.choices[0].message.content)
```

运行代码：
```bash
python chatgpt_quickstart.py
```

### Node.js 示例

创建一个名为 `chatgpt-quickstart.js` 的文件：

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
        {"role": "system", "content": "你是一位富有诗意的助手，擅长用简洁的语言解释复杂的编程概念。"},
        {"role": "user", "content": "请用一首短诗解释什么是递归。"}
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

运行代码：
```bash
node chatgpt-quickstart.js
```

## 下一步

恭喜！你已经成功发送了第一个 OpenAI API 请求。接下来你可以探索：

-   **[文本生成指南](./text-generation.md)**: 深入了解 Chat Completions API 的更多参数和功能（如 JSON 模式、函数调用）。
-   **[Prompt Engineering](./prompt-engineering.md)**: 学习如何优化提示词以获得更好的结果。
-   **[Embeddings](./embeddings.md)**: 学习如何构建搜索和推荐系统。
-   **[Image Generation](./image-generation.md)**: 探索 DALL·E 图像生成能力。

