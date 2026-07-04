# 12_论文综述

> 本章不是论文仓库，而是一张多模态研究地图：用少量关键论文串起表示、对齐、融合、生成、训练、评测和行动。

**By：猫先生 of 「魔方AI空间」**

## 本章定位

多模态论文更新很快，逐篇追模型容易失去主线。

更稳妥的读法是始终追问七个问题：

```text
模态如何表示？
不同模态如何对齐？
信息如何融合？
模型如何理解与生成？
数据和训练如何组织？
能力如何可靠评测？
模型如何进入环境并行动？
```

模型名称会变化，这七个问题不会。

## 选文原则

本章优先保留三类论文：

| 类型 | 选择标准 |
| --- | --- |
| 奠基工作 | 定义了长期沿用的问题、架构或训练范式 |
| 代表工作 | 把一个方向推进到新的系统形态 |
| 综述与评测 | 提供稳定分类、统一语言或诊断方法 |

以下内容不作为主线：

- 只在单个榜单上领先的模型。
- 缺少方法细节的产品发布。
- 主要贡献是参数、数据或版本增量的报告。
- 很快会被下一代模型替代的横向排名。

检索日期：**2026-07-04**。新增论文时，应优先判断它改变了哪条主线，而不是只看发布日期。

## 先读三篇综述

| 顺序 | 论文 | 读什么 |
| ---: | --- | --- |
| 1 | [Multimodal Machine Learning: A Survey and Taxonomy](https://arxiv.org/abs/1705.09406) | 表示、翻译、对齐、融合与协同学习的基础问题 |
| 2 | [A Survey of Vision-Language Pre-Trained Models](https://arxiv.org/abs/2202.10936) | 视觉语言预训练的编码器、交互结构、目标和下游任务 |
| 3 | [Multimodal Foundation Models: From Specialists to General-Purpose Assistants](https://arxiv.org/abs/2309.10020) | 从专用模型到通用多模态助手的演进 |

第一篇最重要。它不依赖某一代大模型，提出的问题框架至今仍然有效。

如果需要补充 MLLM 时代的模型、数据、评测和幻觉，可继续读：

- [A Survey on Multimodal Large Language Models](https://arxiv.org/abs/2306.13549)
- [Hallucination of Multimodal Large Language Models: A Survey](https://arxiv.org/abs/2404.18930)

## 主线一：表示

表示决定原始模态如何变成 Token 或特征。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | Transformer | 序列建模和 Attention |
| [An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929) | ViT | 图像 Patch 如何序列化 |
| [Neural Discrete Representation Learning](https://arxiv.org/abs/1711.00937) | VQ-VAE | 连续内容如何变成离散 Token |
| [wav2vec 2.0](https://arxiv.org/abs/2006.11477) | 自监督语音表示 | 原始音频如何学习通用表示 |

读完要回答：

- 模型处理的是像素、Patch、连续特征还是离散 Token？
- 表示保留了哪些信息，又丢掉了什么？
- 表示长度如何影响上下文和计算成本？

## 主线二：跨模态对齐

对齐解决不同模态如何进入可比较、可交互的语义空间。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [CLIP](https://arxiv.org/abs/2103.00020) | 图文对比学习 | 正负样本和开放语义 |
| [ALIGN](https://arxiv.org/abs/2102.05918) | 大规模弱监督图文对齐 | 数据规模与噪声 |
| [CLAP](https://arxiv.org/abs/2206.04769) | 音频文本对齐 | CLIP 思想如何迁移到声音 |

读完要回答：

- 对齐发生在全局、区域、帧还是 Token 层？
- 对比学习学到了语义，还是数据集偏差？
- 图文相关是否等于细粒度对应？

## 主线三：连接器与融合

连接器决定视觉或音频特征如何进入语言模型。

| 论文 | 结构 | 长期价值 |
| --- | --- | --- |
| [Flamingo](https://arxiv.org/abs/2204.14198) | Perceiver Resampler + Cross-Attention | 交错图文上下文和多模态 few-shot |
| [BLIP-2](https://arxiv.org/abs/2301.12597) | Q-Former | 连接冻结视觉编码器与冻结 LLM |
| [LLaVA](https://arxiv.org/abs/2304.08485) | Projector + 视觉指令微调 | 简洁的开源多模态助手路线 |

读完要回答：

- 视觉 Token 如何压缩？
- 哪些模块冻结，哪些模块训练？
- 连接器只是维度映射，还是主动筛选信息？
- 简单 Projector 为什么有时也能有效？

## 主线四：理解与指令学习

从图文对齐走向多模态助手，关键变化是指令数据和 LLM 底座。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [BLIP](https://arxiv.org/abs/2201.12086) | 统一图文理解与生成 | 数据过滤和多目标训练 |
| [InstructBLIP](https://arxiv.org/abs/2305.06500) | 视觉指令调优 | 多任务指令数据如何迁移 |
| [Qwen-VL](https://arxiv.org/abs/2308.12966) | 理解、定位和文字读取 | 通用任务与细粒度能力结合 |

读完要回答：

- 预训练和指令微调分别贡献什么？
- 模型是否真正使用视觉证据？
- 能力提升来自结构、数据还是 LLM 底座？

## 主线五：多模态生成

生成模型的长期主线是内容表示、采样范式与条件控制。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) | 扩散生成 | 加噪和去噪过程 |
| [Latent Diffusion Models](https://arxiv.org/abs/2112.10752) | 潜空间扩散 | 质量与计算效率的平衡 |
| [Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748) | DiT | Transformer 如何替代 U-Net 主干 |
| [ControlNet](https://arxiv.org/abs/2302.05543) | 结构条件控制 | 从自由生成走向约束生成 |
| [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747) | 连续生成路径 | 扩散之外的统一生成视角 |

读完要回答：

- 生成发生在像素、离散 Token 还是连续 Latent？
- 条件如何进入生成过程？
- 质量、速度、可控性和可编辑性如何取舍？

## 主线六：视频与音频

视频和音频都引入时间，但建模对象不同。

| 论文 | 方向 | 阅读重点 |
| --- | --- | --- |
| [TimeSformer](https://arxiv.org/abs/2102.05095) | 视频理解 | 空间与时间 Attention |
| [VideoMAE](https://arxiv.org/abs/2203.12602) | 视频自监督 | 时间冗余和掩码预训练 |
| [Video-LLaMA](https://arxiv.org/abs/2306.02858) | Video-LLM | 音视频特征如何接入 LLM |
| [Video Diffusion Models](https://arxiv.org/abs/2204.03458) | 视频生成 | 扩散模型如何建模时间 |
| [Whisper](https://arxiv.org/abs/2212.04356) | 语音识别 | 大规模弱监督和多语言鲁棒性 |
| [AudioLM](https://arxiv.org/abs/2209.03143) | 音频生成 | 语义 Token 与声学 Token |

读完要回答：

- 时间是按帧、片段还是事件建模？
- 长序列如何压缩？
- 音频、字幕和画面如何对齐？
- 生成内容如何保持跨时间一致性？

## 主线七：数据与训练

模型结构相近时，数据往往决定能力边界。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [LAION-5B](https://arxiv.org/abs/2210.08402) | 大规模开放图文数据 | 规模、噪声、许可和偏差 |
| [DataComp](https://arxiv.org/abs/2304.14108) | 数据中心化 Benchmark | 固定训练条件下比较数据策略 |
| [Improved Baselines with Visual Instruction Tuning](https://arxiv.org/abs/2310.03744) | LLaVA 1.5 | 数据、分辨率和训练细节的影响 |
| [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 直接偏好优化 | 偏好目标的通用基础 |

读完要回答：

- 数据来自哪里，是否真正对齐？
- 是否去重、去污染并记录许可？
- 训练分几阶段，各阶段更新哪些模块？
- 能力提升是否伴随旧能力退化？

## 主线八：评测与幻觉

评测论文应作为诊断工具阅读，而不是只看榜单。

| 论文 | 评测重点 |
| --- | --- |
| [MME](https://arxiv.org/abs/2306.13394) | 感知与认知能力 |
| [MMBench](https://arxiv.org/abs/2307.06281) | 多维能力与规范化选择题 |
| [MMMU](https://arxiv.org/abs/2311.16502) | 专业领域多模态推理 |
| [POPE](https://arxiv.org/abs/2305.10355) | 对象幻觉 |
| [HallusionBench](https://arxiv.org/abs/2310.14566) | 视觉错觉与语言幻觉 |

读完要回答：

- 题目是否必须使用模态证据？
- 指标是否真的衡量目标能力？
- 测试集是否可能进入训练数据？
- Judge 是否经过人工校准？

## 主线九：Agent 与行动

多模态 Agent 把理解扩展到环境交互。

| 论文 | 核心贡献 | 阅读重点 |
| --- | --- | --- |
| [ReAct](https://arxiv.org/abs/2210.03629) | 推理与行动交替 | Agent 基本闭环 |
| [PaLM-E](https://arxiv.org/abs/2303.03378) | 具身多模态语言模型 | 连续传感信息如何进入 LLM |
| [RT-2](https://arxiv.org/abs/2307.15818) | Vision-Language-Action | 从网络知识到机器人动作 |
| [OSWorld](https://arxiv.org/abs/2404.07972) | 真实计算机环境评测 | GUI Agent 的任务成功与失败归因 |

读完要回答：

- 观察如何变成状态？
- 语言目标如何 Ground 到对象和位置？
- 行动后是否重新观察并验证？
- 权限、注入和高风险动作如何控制？

## 十五篇核心阅读

时间有限时，按这个顺序读：

1. [Multimodal Machine Learning: A Survey and Taxonomy](https://arxiv.org/abs/1705.09406)
2. [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
3. [Vision Transformer](https://arxiv.org/abs/2010.11929)
4. [CLIP](https://arxiv.org/abs/2103.00020)
5. [BLIP](https://arxiv.org/abs/2201.12086)
6. [Flamingo](https://arxiv.org/abs/2204.14198)
7. [BLIP-2](https://arxiv.org/abs/2301.12597)
8. [LLaVA](https://arxiv.org/abs/2304.08485)
9. [Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
10. [ControlNet](https://arxiv.org/abs/2302.05543)
11. [VideoMAE](https://arxiv.org/abs/2203.12602)
12. [Whisper](https://arxiv.org/abs/2212.04356)
13. [DataComp](https://arxiv.org/abs/2304.14108)
14. [MMMU](https://arxiv.org/abs/2311.16502)
15. [ReAct](https://arxiv.org/abs/2210.03629)

这条路线依次覆盖：基础问题、架构、对齐、融合、助手、生成、时序、音频、数据、评测和行动。

## 如何读一篇多模态论文？

只记住八个问题：

1. 论文解决哪个长期问题？
2. 输入和输出是什么？
3. 每种模态如何表示？
4. 模态在哪里对齐或融合？
5. 哪些模块训练，哪些模块冻结？
6. 能力提升来自结构、数据还是计算量？
7. 评测能否隔离论文声称的贡献？
8. 失败案例揭示了什么边界？

建议用 [论文笔记模板](../templates/paper-note-template.md) 记录。不要复述全文，只保留问题、方法、证据、局限和可迁移结论。

## 如何维护这份综述？

新增论文前先判断：

| 判断 | 处理 |
| --- | --- |
| 提出新的长期问题或范式 | 加入主线 |
| 显著改变数据、训练或评测方法 | 加入对应章节 |
| 是重要系统实现，但方法增量有限 | 放入专题章节 |
| 主要刷新榜单或产品版本 | 不进入核心列表 |
| 结论尚未稳定 | 标注为观察项 |

每条主线保留少量代表论文，比无限扩展列表更有价值。

## 长期不变的阅读框架

多年以后，回看任何多模态论文，仍可沿着这条链路判断：

```text
表示
  -> 对齐
  -> 融合
  -> 理解 / 生成
  -> 数据与训练
  -> 评测与安全
  -> 工具与行动
```

如果一篇论文无法说明自己改变了链路中的哪一环，它的长期价值通常有限。

## 章节索引

| 主线 | 对应章节 |
| --- | --- |
| 表示 | [视觉编码器](../02_视觉编码器/README.md)、[文本编码器与 LLM 底座](../03_文本编码器与LLM底座/README.md) |
| 对齐与融合 | [跨模态对齐与连接器](../04_跨模态对齐与连接器/README.md) |
| 视觉语言模型 | [视觉语言模型 VLM](../05_视觉语言模型VLM/README.md) |
| 生成 | [多模态生成模型](../06_多模态生成模型/README.md) |
| 视频与音频 | [视频多模态](../07_视频多模态/README.md)、[音频语音多模态](../08_音频语音多模态/README.md) |
| 数据与训练 | [多模态数据与训练](../09_多模态数据与训练/README.md) |
| 评测 | [多模态评测](../10_多模态评测/README.md) |
| Agent | [多模态 Agent 与应用](../11_多模态Agent与应用/README.md) |

## 本章小结

论文综述的目的不是证明读过很多，而是建立稳定坐标系。

抓住九条主线：

```text
表示、对齐、连接、理解、生成
视频音频、数据训练、评测安全、Agent 行动
```

新论文出现时，把它放回坐标系中判断：解决了什么旧问题，提出了什么新证据，代价是什么，边界在哪里。

---

**上一章：**[多模态 Agent 与应用](../11_多模态Agent与应用/README.md)  
**下一章建议阅读：**[实战项目](../13_实战项目/README.md)
