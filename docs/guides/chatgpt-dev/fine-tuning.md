---
title: Fine-tuning (微调)
description: 学习如何通过微调 (Fine-tuning) 定制 GPT 模型，以适应特定的应用场景和风格。
---

# Fine-tuning (微调)

微调允许你在自定义数据集上训练 OpenAI 的模型，从而获得比标准模型更好的特定任务性能。

## 为什么需要微调？

通常，通过 Prompt Engineering (提示工程) 就可以获得很好的结果。你应该先尝试优化 Prompt。当 Prompt Engineering 达到瓶颈时，再考虑微调。

微调的优势：
1.  **更高质量的结果**: 明显优于仅通过 Prompt 设计的效果。
2.  **节省 Token**: 可以训练模型使其不需要冗长的示例（Few-shot examples），从而节省 Prompt 的长度和成本。
3.  **更低的延迟**: 输入更短，处理更快。

## 微调流程

### 1. 准备数据
数据必须是 JSONL 格式，每一行是一个完整的训练样本。

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
```

-   建议至少准备 **10 个**样本来验证流程。
-   通常需要 **50-100 个**高质量样本才能看到明显效果。

### 2. 上传文件

```python
from openai import OpenAI
client = OpenAI()

client.files.create(
  file=open("mydata.jsonl", "rb"),
  purpose="fine-tune"
)
```

### 3. 创建微调作业 (Job)

```python
client.fine_tuning.jobs.create(
  training_file="file-xyz...", # 上一步返回的 file ID
  model="gpt-3.5-turbo" 
)
```

### 4. 使用微调模型

一旦作业完成，你将获得一个自定义模型 ID（如 `ft:gpt-3.5-turbo:org_id:users_id:ts`）。你可以像使用普通模型一样使用它：

```python
completion = client.chat.completions.create(
  model="ft:gpt-3.5-turbo:my-org:custom_suffix:id",
  messages=[
    {"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."},
    {"role": "user", "content": "What is the capital of the Moon?"}
  ]
)
```

## 支持的模型
-   `gpt-4o` (最新)
-   `gpt-4o-mini`
-   `gpt-3.5-turbo`
-   `babbage-002`, `davinci-002` (旧版基础模型)

## 最佳实践
-   **迭代**: 从少量数据开始，验证格式和基本效果，然后逐渐增加数据量。
-   **质量优先**: 数据的质量比数量更重要。确保示例回复正是你希望模型输出的样子。

