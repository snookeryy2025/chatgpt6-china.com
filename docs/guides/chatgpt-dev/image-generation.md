---
title: Image Generation (图像生成)
description: 使用 DALL·E 3 模型根据文本提示生成和编辑图像。
---

# Image Generation (图像生成)

OpenAI 的图像生成 API 基于 DALL·E 模型。目前最新的 DALL·E 3 模型能够根据自然语言描述生成极其生动、细节丰富的图像。

## 功能特性

-   **从头生成 (Generations)**: 根据文本提示创建全新的图像 (DALL·E 3 & DALL·E 2)。
-   **编辑 (Edits)**: 上传原图和遮罩 (Mask)，修改图像的特定区域 (仅 DALL·E 2)。
-   **变体 (Variations)**: 生成与原图风格和构图相似的新图像 (仅 DALL·E 2)。

## 生成图像 (DALL·E 3)

DALL·E 3 的特点是能够非常精确地遵循复杂的指令。它会自动重写你的 Prompt 以包含更多细节。

```python
from openai import OpenAI
client = OpenAI()

response = client.images.generate(
  model="dall-e-3",
  prompt="一只赛博朋克风格的猫正在霓虹灯闪烁的东京街头喝咖啡",
  size="1024x1024",
  quality="standard",
  n=1,
)

image_url = response.data[0].url
print(image_url)
```

### 参数说明

-   **model**: `dall-e-3` (推荐) 或 `dall-e-2`。
-   **prompt**: 图像描述，最长 4000 字符。
-   **size**: DALL·E 3 支持 `1024x1024`, `1024x1792` (竖屏), `1792x1024` (横屏)。
-   **quality**: `standard` 或 `hd` (高清，细节更丰富)。
-   **style**: `vivid` (默认，生动逼真) 或 `natural` (更自然，像照片)。

## 编辑与变体 (DALL·E 2)

DALL·E 2 提供了更多操作现有图片的能力，但画质和理解力不如 DALL·E 3。

### 图像编辑 (Inpainting)
需要上传两张图：
1.  **Image**: 原图。
2.  **Mask**: 遮罩图，透明区域表示需要被修改的地方。

```python
response = client.images.edit(
  model="dall-e-2",
  image=open("sunlit_lounge.png", "rb"),
  mask=open("mask.png", "rb"),
  prompt="A sunlit indoor lounge area with a pool containing a flamingo",
  n=1,
  size="1024x1024"
)
```

### 图像变体 (Variations)
```python
response = client.images.create_variation(
  image=open("corgi_and_cat_playing.png", "rb"),
  n=1,
  size="1024x1024"
)
```

