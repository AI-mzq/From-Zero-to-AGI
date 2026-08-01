# 多模态基础入门索引

> 这里是 `03_多模态基础入门` 的长期维护索引。新增章节、论文、模型、项目时，优先更新本文件，保证知识库入口稳定。

## 主题索引

| 编号 | 主题 | 目录 | 维护内容 |
| ---: | --- | --- | --- |
| 00 | 板块导读 | [00_板块导读](00_板块导读/README.md) | 学习路线、知识地图、维护说明 |
| 01 | 多模态基础概念 | [01_多模态基础概念](01_多模态基础概念/README.md) | 模态、跨模态、多模态任务分类 |
| 02 | 视觉编码器 | [02_视觉编码器](02_视觉编码器/README.md) | CNN、ViT、CLIP Vision Encoder、SigLIP |
| 03 | 文本编码器与 LLM 底座 | [03_文本编码器与LLM底座](03_文本编码器与LLM底座/README.md) | LLM、Tokenizer、视觉 Token 接入方式 |
| 04 | 跨模态对齐与连接器 | [04_跨模态对齐与连接器](04_跨模态对齐与连接器/README.md) | Projection、Q-Former、Cross-Attention、Resampler |
| 05 | 视觉语言模型 VLM | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) | CLIP、BLIP、Flamingo、LLaVA、Qwen-VL |
| 06 | 多模态生成模型 | [06_多模态生成模型](06_多模态生成模型/README.md) | 文生图、图生文、统一生成、扩散与自回归 |
| 07 | 视频多模态 | [07_视频多模态](07_视频多模态/README.md) | 视频理解、时序建模、视频生成 |
| 08 | 音频语音多模态 | [08_音频语音多模态](08_音频语音多模态/README.md) | ASR、TTS、Audio-Language、实时语音助手 |
| 09 | 多模态数据与训练 | [09_多模态数据与训练](09_多模态数据与训练/README.md) | 图文对、视频数据、指令数据、偏好数据 |
| 10 | 多模态评测 | [10_多模态评测](10_多模态评测/README.md) | VQA、OCR、幻觉、安全、Benchmark |
| 11 | 多模态 Agent 与应用 | [11_多模态Agent与应用](11_多模态Agent与应用/README.md) | GUI Agent、文档理解、RAG、工具调用 |
| 12 | 论文综述 | [12_论文综述](12_论文综述/README.md) | 论文阅读路线、综述、经典论文 |
| 13 | 实战项目 | [13_实战项目](13_实战项目/README.md) | Demo、复现、评测脚本、实验记录 |

## 论文索引

| 方向 | 起点论文 / 报告 | 后续维护位置 |
| --- | --- | --- |
| 图文对齐 | CLIP、ALIGN、SigLIP | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| 视觉语言模型 | BLIP、BLIP-2、Flamingo、LLaVA | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| 连接器 | Q-Former、Perceiver Resampler、MLP Projector | [04_跨模态对齐与连接器](04_跨模态对齐与连接器/README.md) |
| 统一多模态 | Kosmos、Emu、Chameleon、Gemini、GPT-4V / 4o | [06_多模态生成模型](06_多模态生成模型/README.md) |
| 视频多模态 | VideoChatGPT、Video-LLaVA、VideoPoet、Sora 技术路线 | [07_视频多模态](07_视频多模态/README.md) |
| 音频语音 | Whisper、AudioPaLM、SpeechGPT、Qwen-Audio | [08_音频语音多模态](08_音频语音多模态/README.md) |
| 评测安全 | MME、MMBench、MMMU、HallusionBench、POPE | [10_多模态评测](10_多模态评测/README.md) |

## 模型索引

| 模型家族 | 重点能力 | 维护位置 |
| --- | --- | --- |
| CLIP / SigLIP | 图文表示对齐、检索、零样本分类 | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| BLIP / BLIP-2 | 图文理解、Caption、VQA | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| LLaVA | 视觉指令微调、开源 VLM 生态 | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| Qwen-VL / Qwen2-VL | 中文、多语言、OCR、视觉推理 | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| InternVL | 开源 VLM、OCR、文档理解 | [05_视觉语言模型VLM](05_视觉语言模型VLM/README.md) |
| Gemini / GPT-4V / GPT-4o | 统一多模态能力、实时交互 | [06_多模态生成模型](06_多模态生成模型/README.md) |
| Whisper / Qwen-Audio | 语音识别、音频理解 | [08_音频语音多模态](08_音频语音多模态/README.md) |

## 模板索引

- [章节模板](templates/chapter-template.md)
- [论文笔记模板](templates/paper-note-template.md)
- [模型卡模板](templates/model-card-template.md)
- [实验记录模板](templates/experiment-log-template.md)

## 维护检查清单

新增内容时建议检查：

- 是否放入正确主题目录。
- 是否更新本索引。
- 是否补充外部论文/项目链接。
- 是否说明适用场景和局限性。
- 是否与 `02_LLM基础入门`、`05_AI视频基础入门`、`07_Agent-RAG-MCP` 建立交叉链接。
