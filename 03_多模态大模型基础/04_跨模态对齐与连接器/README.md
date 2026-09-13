# 04_跨模态对齐与连接器

> 视觉编码器负责提取视觉特征，LLM 底座负责语言和推理。连接器要做的事，就是把这两套表示接起来，让 LLM 能稳定使用图像、视频或音频信息。

**By：猫先生 of 「魔方AI空间」**

## 本章导读

前面两章分别讲了 [视觉编码器](../02_视觉编码器/README.md) 和 [LLM 底座](../03_文本编码器与LLM底座/README.md)。

但这两个模块之间还有一个关键问题：

```text
视觉编码器输出的是视觉特征
LLM 处理的是文本上下文和隐空间表示
两者不能直接天然互通
```

这就是连接器存在的原因。

一个简化流程是：

```text
图像
  -> 视觉编码器
  -> 视觉特征
  -> 连接器
  -> LLM 可用的视觉 Token
  -> 多模态回答
```

这一章重点回答：

- 什么是跨模态对齐？
- 为什么视觉特征不能直接丢给 LLM？
- Linear Projector、MLP Projector、Q-Former、Perceiver Resampler、Cross-Attention 有什么区别？
- Early Fusion、Late Fusion、Hybrid Fusion 分别适合什么场景？
- 视觉 Token 压缩为什么重要？
- 连接器如何影响多模态模型的能力、成本和幻觉？

## 一句话理解连接器

连接器可以理解为：

> 把视觉、音频或视频编码器输出的特征，转换成 LLM 能接收、能理解、能参与生成的表示。

它不是简单的格式转换，而是跨模态语义对齐的一部分。

如果连接器做得不好，可能出现：

- LLM 收到了视觉 Token，但不知道怎么用。
- 图像细节丢失，OCR、图表、位置关系表现差。
- 视觉 Token 太多，成本和延迟过高。
- 视觉特征和语言语义对不上，模型更容易幻觉。

所以连接器是多模态系统里很小但很关键的一段桥。

## 什么是跨模态对齐？

跨模态对齐是让不同模态的表示在语义上能够对应起来。

例如：

```text
图像中的一只黑猫
  <-> 文本中的“a black cat”
```

或者：

```text
PDF 第 2 页右上角的表格
  <-> 用户问题里的“右上角这张表”
```

对齐可以发生在不同粒度：

| 粒度 | 对齐对象 | 例子 |
| --- | --- | --- |
| 全局级 | 整张图和整段文本 | 图文检索 |
| 区域级 | 图像区域和短语 | “红色杯子”对应图中某个物体 |
| Patch 级 | Patch Token 和文本上下文 | 细粒度 VQA、OCR |
| 帧级 | 视频帧和事件描述 | “摔倒”对应某段视频 |
| 文档级 | 页面、段落、表格和问题 | 文档问答和引用 |

CLIP、ALIGN 这类模型主要打通了全局图文语义空间。现代 MLLM 还需要更细粒度的对齐，让 LLM 能看懂局部、文字、区域和时序。

## 为什么不能直接把视觉特征给 LLM？

视觉编码器输出的特征和 LLM 的输入空间通常不匹配。

| 不匹配点 | 说明 |
| --- | --- |
| 维度不同 | 视觉特征维度和 LLM hidden size 可能不同 |
| 训练目标不同 | 视觉编码器可能为分类、检索或自监督训练，LLM 为语言生成训练 |
| 语义空间不同 | 视觉特征不一定天然对应语言语义 |
| Token 数不同 | 图像 Patch 很多，可能远超 LLM 可承受预算 |
| 使用方式不同 | LLM 需要能把视觉信息放进上下文中参与生成 |

连接器就是为了解决这些不匹配。

## 连接器在系统中的位置

一个常见 MLLM 主干可以写成：

```text
Vision Encoder
  -> Visual Features
  -> Connector
  -> Visual Tokens in LLM Space
  -> LLM
```

更完整一点：

```text
图像 / 视频 / 文档
  -> 视觉编码器
  -> Patch 特征 / 区域特征 / 帧特征
  -> 连接器压缩或映射
  -> 插入 Prompt 上下文
  -> LLM 生成回答
```

连接器通常承担三类任务：

| 任务 | 说明 |
| --- | --- |
| 映射 | 把视觉特征维度映射到 LLM hidden size |
| 筛选 | 从大量视觉特征中选出更有用的信息 |
| 压缩 | 控制视觉 Token 数，降低上下文和推理成本 |

## Linear Projector / MLP Projector

最简单的连接器是线性投影。

```text
visual_feature
  -> Linear / MLP
  -> LLM_hidden_space
```

LLaVA 早期路线就采用了较简单的视觉特征投影方式，把 CLIP 视觉编码器输出映射到 LLM 可接收的空间，再进行视觉指令微调。

优点：

- 结构简单
- 易训练
- 工程实现直接
- 推理开销小

局限：

- 对视觉 Token 筛选能力有限
- 对复杂区域关系建模较弱
- 需要依赖后续 LLM 和指令数据学习如何使用视觉信息

Projector 路线适合先把多模态系统跑通，也是很多开源 VLM 的基础方案。

## Q-Former

Q-Former 是 BLIP-2 中的关键模块。

它的核心思路是：不用把所有视觉 Token 都交给 LLM，而是用一组可学习 Query，从视觉特征中“查询”出更紧凑的信息。

```text
视觉特征
  -> Q-Former
  -> 少量 Query Tokens
  -> LLM
```

可以把 Q-Former 理解成一个信息提取器：

- 输入是大量视觉特征。
- Query Token 主动去关注相关视觉信息。
- 输出是一组压缩后的视觉语义 Token。

优点：

- 能控制输出 Token 数。
- 对冻结视觉编码器和冻结 LLM 比较友好。
- 比简单 Projector 多了一层可学习的信息筛选。

局限：

- 结构比 Projector 复杂。
- Query 数量会限制视觉信息容量。
- 对 OCR、细粒度区域、复杂版面任务仍可能不足。

## Perceiver Resampler

Flamingo 使用 Perceiver Resampler 将视觉特征压缩成固定数量的视觉 Token，再通过 Cross-Attention 接入语言模型。

它解决的是一个很实际的问题：

```text
图像 / 视频特征很多
  -> 不能全部塞给 LLM
  -> 需要压缩成固定长度表示
```

Perceiver Resampler 的价值在于：

- 面向多图和视频输入更友好。
- 可以把可变数量视觉特征压缩成固定数量 Token。
- 便于控制上下文成本。

它适合处理视觉输入较多、需要统一压缩表示的场景。

## Cross-Attention

Cross-Attention 的思路是：语言模型的某些层可以主动关注视觉特征。

```text
Text hidden states -> Query
Visual features -> Key / Value
```

这样 LLM 在生成文本时，可以通过注意力机制读取视觉信息。

优点：

- 文本生成过程可以动态关注视觉特征。
- 适合多轮视觉语言交互。
- 对复杂上下文更灵活。

局限：

- 改动 LLM 结构，工程复杂度更高。
- 训练和部署成本通常高于简单 Projector。
- 和已有 LLM 权重兼容性需要额外处理。

Flamingo 就是在冻结语言模型的基础上插入 gated cross-attention 层，让语言模型接入视觉上下文。

## Early Fusion、Late Fusion、Hybrid Fusion

跨模态融合可以按发生位置粗略分成三类。

| 融合方式 | 思路 | 优点 | 局限 |
| --- | --- | --- | --- |
| Early Fusion | 早期把视觉 Token 和文本 Token 放到一起 | 交互充分 | Token 成本高，对齐难 |
| Late Fusion | 各模态先独立编码，最后融合结果 | 工程简单，成本可控 | 细粒度交互弱 |
| Hybrid Fusion | 部分阶段独立编码，部分阶段交互 | 灵活，适合复杂系统 | 设计和训练更复杂 |

现代 MLLM 常常不是纯粹某一种，而是混合方案。

例如：

- 视觉编码器先独立提取特征。
- 连接器压缩或映射视觉 Token。
- LLM 在上下文中融合视觉和文本。
- 必要时再调用 OCR、检索或工具补充信息。

## 视觉 Token 压缩

视觉 Token 压缩是连接器里非常重要的问题。

原因很简单：视觉 Token 太贵。

一张高分辨率图像可能产生数百到数千视觉 Token；多图、多页 PDF、长视频会更夸张。

常见压缩方式包括：

| 方法 | 思路 |
| --- | --- |
| Pooling | 对 Patch 特征做池化 |
| Query-based Compression | 用 Query Token 提取关键信息，例如 Q-Former |
| Resampler | 把可变视觉特征重采样为固定长度 Token |
| Region Selection | 只保留重要区域 |
| Dynamic Resolution | 根据任务动态选择分辨率 |
| Token Pruning | 丢弃低价值视觉 Token |

压缩不是免费的。

```text
压缩越强
  -> 成本越低
  -> 细节越可能丢失
```

OCR、文档、图表、GUI 这类任务通常更怕过度压缩，因为细节丢了就很难靠 LLM 补回来。

## 连接器对能力的影响

连接器会影响模型的多个方面。

| 影响维度 | 说明 |
| --- | --- |
| 细节保留 | 小字、局部区域、对象关系是否被保留 |
| 推理成本 | 视觉 Token 数决定上下文占用和 Attention 成本 |
| 对齐质量 | 视觉特征是否能被 LLM 正确使用 |
| 训练稳定性 | 映射空间是否容易学习 |
| 泛化能力 | 是否能适应不同图像、分辨率、任务类型 |
| 幻觉风险 | 对齐差或信息丢失时，LLM 更容易猜 |

所以连接器不是论文结构图里随便一画的小方块。它决定了视觉信息以什么方式、多少信息量、什么语义形态进入 LLM。

## 代表路线对比

| 路线 | 代表模型 | 连接方式 | 适合理解 |
| --- | --- | --- | --- |
| 简单 Projector | LLaVA | 视觉特征投影到 LLM 空间 | 工程简洁、视觉指令微调 |
| Q-Former | BLIP-2 | Query 从视觉特征中提取信息 | 冻结视觉编码器和 LLM 的桥接 |
| Perceiver Resampler | Flamingo | 压缩多图 / 视频视觉特征 | 少样本视觉语言学习 |
| Cross-Attention | Flamingo 等 | LLM 层中读取视觉特征 | 动态视觉语言交互 |
| 多粒度连接 | Qwen-VL、InternVL 等 | 高分辨率、区域、OCR、动态策略 | 文档、OCR、定位、复杂任务 |

这张表只是帮助建立主线。真实模型经常会混合多种方法。

## 连接器与训练目标

连接器通常需要配合训练目标一起看。

| 训练目标 | 作用 |
| --- | --- |
| 图文对比学习 | 建立全局图文语义对齐 |
| 图像描述生成 | 让视觉信息转成自然语言 |
| VQA / 指令微调 | 教模型按用户问题使用视觉信息 |
| OCR / 文档任务 | 强化文字和版面理解 |
| Grounding 任务 | 建立语言短语与区域的对应关系 |
| 偏好对齐 | 改善回答风格、安全和拒答边界 |

同一个连接器，在不同训练数据和目标下会表现出不同能力。

因此不要只看结构，也要看它是怎么训练的。

## 常见误区

### 1. 连接器只是维度映射

维度映射只是最基本功能。真正关键的是语义对齐、信息筛选和 Token 预算控制。

### 2. Token 压缩越强越好

压缩能省成本，但可能丢掉小字、表格、区域关系和细节证据。

### 3. Cross-Attention 一定比 Projector 好

Cross-Attention 更灵活，但也更复杂。简单 Projector 在合适数据和任务下依然很有效。

### 4. 只要图文对齐好，就能做复杂 VQA

图文对齐主要解决语义匹配。复杂 VQA 还需要指令微调、推理能力和细粒度视觉证据。

### 5. 连接器能弥补视觉编码器缺陷

如果视觉编码器没有捕捉到关键信息，连接器很难凭空恢复。

## 前瞻性判断

### 1. 连接器会越来越重视动态选择

不同任务需要不同视觉粒度。未来连接器会更多支持按任务动态选择区域、分辨率和 Token 数。

### 2. 细粒度 Grounding 会成为基础能力

模型需要知道答案来自哪里：哪张图、哪个区域、哪一页、哪一帧。连接器会和区域定位、引用、时间戳更紧密结合。

### 3. 多模态上下文会推动更强压缩

多图、多页 PDF、长视频、GUI 历史操作都会让视觉 Token 暴涨。Token 压缩和信息保真会长期拉扯。

### 4. 连接器会从单图走向多源输入

未来连接器不只处理图片，还要处理视频帧、音频片段、文档版面、GUI 截图、检索结果和工具反馈。

## 本章小结

跨模态连接器的核心可以概括为：

```text
视觉 / 音频 / 视频特征
  -> 映射到 LLM 隐空间
  -> 压缩或筛选关键信息
  -> 与文本上下文融合
  -> 支持回答、推理和工具调用
```

学习连接器时，不要只记 Projector、Q-Former、Cross-Attention 这些名字。更重要的是看它解决了哪类不匹配：维度不匹配、语义不匹配、Token 数过多，还是细粒度证据不足。

## 推荐阅读与引用来源

- [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020)：CLIP，图文对比学习和全局语义对齐基础。
- [Scaling Up Visual and Vision-Language Representation Learning With Noisy Text Supervision](https://arxiv.org/abs/2102.05918)：ALIGN，大规模噪声图文对训练视觉语言表示。
- [BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models](https://arxiv.org/abs/2301.12597)：提出 Q-Former，用于连接冻结视觉编码器和冻结 LLM。
- [Flamingo: a Visual Language Model for Few-Shot Learning](https://arxiv.org/abs/2204.14198)：使用 Perceiver Resampler 和 gated cross-attention 接入视觉信息。
- [Visual Instruction Tuning](https://arxiv.org/abs/2304.08485)：LLaVA，使用视觉特征投影和视觉指令微调构建开源 VLM。
- [Qwen-VL: A Versatile Vision-Language Model for Understanding, Localization, Text Reading, and Beyond](https://arxiv.org/abs/2308.12966)：展示视觉语言模型在理解、定位、文字读取等任务上的系统设计。

---

**上一章：**[文本编码器与 LLM 底座](../03_文本编码器与LLM底座/README.md)  
**下一章建议阅读：**[视觉语言模型 VLM](../05_视觉语言模型VLM/README.md)
