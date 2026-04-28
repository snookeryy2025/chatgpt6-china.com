---
title: Speech (语音)
description: 了解 OpenAI 的 TTS (文本转语音) 和 Whisper (语音转文本) 模型。
---

# Speech (语音)

OpenAI 提供了强大的语音处理能力，包括将文本转换为逼真的语音 (Text-to-Speech) 以及将音频转换为文本 (Speech-to-Text)。

## Text to Speech (文本转语音)

TTS API 允许你从文本生成类似真人的语音音频。基于 `tts-1` 和 `tts-1-hd` 模型。

### 快速开始

```python
from pathlib import Path
from openai import OpenAI
client = OpenAI()

speech_file_path = Path(__file__).parent / "speech.mp3"

response = client.audio.speech.create(
  model="tts-1",
  voice="alloy",
  input="OpenAI 的语音模型真的非常逼真，你觉得呢？"
)

response.stream_to_file(speech_file_path)
```

### 声音选项 (Voices)
OpenAI 提供了 6 种内置声音，针对英语进行了优化，但也支持多种其他语言：
-   **Alloy** (通用，中性)
-   **Echo**
-   **Fable**
-   **Onyx**
-   **Nova**
-   **Shimmer**

建议通过测试来选择最适合你应用场景的声音。

### 音频质量
-   **tts-1**: 延迟最低，适合实时应用，但某些情况下音质可能略低于 hd 版本。
-   **tts-1-hd**: 音质更好，细节更丰富，但延迟稍高。

## Speech to Text (语音转文本)

基于 **Whisper** 模型，支持转录 (Transcriptions) 和翻译 (Translations)。

### 1. 转录 (Transcriptions)
将音频文件转录为与音频语言相同的文本。

```python
audio_file= open("/path/to/file/audio.mp3", "rb")
transcription = client.audio.transcriptions.create(
  model="whisper-1", 
  file=audio_file
)
print(transcription.text)
```

支持的文件格式：`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`。文件最大不超过 25 MB。

### 2. 翻译 (Translations)
将任何支持语言的音频转录并翻译成**英文**文本。目前仅支持翻译为英文。

```python
audio_file = open("/path/to/file/german.mp3", "rb")
translation = client.audio.translations.create(
  model="whisper-1", 
  file=audio_file
)
print(translation.text)
```

### 提示词 (Prompting)
你可以通过 `prompt` 参数向 Whisper 模型传递一些上下文或特定的拼写校正（例如专有名词、首字母缩略词），以提高识别准确率。

