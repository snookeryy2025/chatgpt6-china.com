---
title: Embeddings (嵌入)
description: 了解 OpenAI Embeddings API，将文本转换为向量以实现语义搜索、聚类和推荐系统。
---

# Embeddings (嵌入)

OpenAI 的 Embeddings API 将文本转换为浮点数列表（向量）。向量之间的距离衡量了它们的相关性：距离越小（通常使用余弦相似度），表示语义越相关；距离越大，表示语义差异越大。

## 什么是 Embeddings?

Embedding 是一个浮点数向量（列表）。
例如：`[0.00230642, -0.00932729, ...]`

如果两个文本的 Embedding 向量在多维空间中距离很近，说明它们含义相似。这对于关键词匹配无法解决的场景（例如“猫”和“喵星人”）非常有用。

## 常见用例

-   **搜索 (Search)**: 根据相关性对结果进行排序。
-   **聚类 (Clustering)**: 将文本分组。
-   **推荐 (Recommendations)**: 推荐具有相关文本字符串的项目。
-   **异常检测 (Anomaly detection)**: 识别相关性极低的离群值。
-   **多样性测量 (Diversity measurement)**: 分析相似度分布。
-   **分类 (Classification)**: 将文本归类到最相似的标签。

## 如何使用

### 获取 Embeddings

```python
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    input="Your text string goes here",
    model="text-embedding-3-small"
)

print(response.data[0].embedding)
```

### 模型选择

OpenAI 推荐使用第三代模型（v3）：

| 模型 | 用途 | 性能 | 成本 |
| :--- | :--- | :--- | :--- |
| **text-embedding-3-small** | 高效、低成本，适合大多数任务 | 优于 v2 | 极低 |
| **text-embedding-3-large** | 最高精度，适合需要极致效果的场景 | 最佳 | 较高 |
| **text-embedding-ada-002** | 上一代模型 (v2) | 良好 | - |

### 降维 (Reducing dimensions)

`text-embedding-3` 系列模型支持通过 `dimensions` 参数缩减输出向量的维度（例如从 1536 降至 256），而不会显著损失性能。这有助于节省向量数据库的存储空间。

## 局限性与风险

-   **Social Bias (社会偏见)**: 模型可能包含训练数据中的偏见或刻板印象。
-   **Blindness to recent events**: Embeddings 模型也是静态的，不知道最新的事件（但这通常影响不大，因为它们主要理解语义关系）。

