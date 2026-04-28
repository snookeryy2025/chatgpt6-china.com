---
title: Vision (视觉)
description: 了解如何使用 GPT-4o 和 GPT-4 Turbo with Vision 模型来理解和分析图像。
---

# Vision (视觉)

GPT-4o 和 GPT-4 Turbo with Vision 具有视觉能力，能够处理图像输入并回答有关图像的问题。

## 能做什么？

-   **物体识别**: 识别图中的物品。
-   **文本识别 (OCR)**: 读取图像中的手写或打印文字。
-   **描述与说明**: 为图像生成标题或详细描述。
-   **图表分析**: 解释数据图表、信息图。
-   **空间关系**: 理解物体之间的相对位置。

## 如何使用

图像可以通过两种方式传递给模型：
1.  **图片 URL**: 指向互联网上可公开访问的图片链接。
2.  **Base64 编码**: 将本地图片转换为 Base64 字符串直接上传。

### 示例代码 (Python)

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "这张图片里有什么？"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
      ],
    }
  ],
  max_tokens=300,
)

print(response.choices[0].message.content)
```

## 图像细节 (Low vs High Fidelity)

通过 `detail` 参数控制模型处理图像的精度：

-   **low**: 禁用高分辨率模型。模型接收 512x512 的低分辨率版本。速度快，消耗 token 少 (固定 85 tokens)。适用于不需要细节的大致描述。
-   **high**: 启用高分辨率。模型先看低分率全图，再将图片切分为 512x512 的方块进行详细分析。消耗 token 取决于图片尺寸。
-   **auto**: 默认值。模型根据图片尺寸自动决定。

## 局限性

-   **医学影像**: 不适合用于解读专业医学图像（如 CT、X光）。
-   **非英语文本**: 处理非拉丁字母的文本（如中文、日文、韩文）时，OCR 性能可能不如英语。
-   **小文本/低分辨率**: 对于非常小的文字或模糊不清的细节可能无法准确识别。
-   **空间推理**: 复杂的几何或精确的空间定位任务（如“苹果确切的坐标在哪里”）可能不准确。

