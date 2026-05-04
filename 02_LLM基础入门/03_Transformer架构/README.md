# 03_Transformer 架构

> Transformer 是现代大语言模型的主干架构。理解 Transformer，就等于抓住了 LLM 内部计算流程的核心骨架。

**原文解读链接🔗：**[Transformer 架构](https://blog.csdn.net/m_aigc2022/article/details/140025423?spm=1001.2014.3001.5501)

**By：猫先生 of 「魔方AI空间」**

## 本章导读

前两章我们已经知道：

```text
文本 -> Token -> Token ID -> Embedding
```

Embedding 之后，真正负责理解上下文、聚合信息、生成下一步表示的，就是 Transformer。

Transformer 最早由论文 [Attention Is All You Need](https://arxiv.org/abs/1706.03762) 提出。它抛弃了传统 RNN 的串行递归结构，改用 Self-Attention 直接建模序列中任意位置之间的关系，因此非常适合大规模并行训练。

本章重点回答：

- Transformer 为什么重要？
- 原始 Transformer 和现代 LLM 架构有什么区别？
- Decoder-only LLM 内部由哪些组件组成？
- 一个 Transformer Block 中发生了什么？
- Residual、LayerNorm、FFN、Attention 分别起什么作用？
- 为什么现代大模型几乎都采用堆叠 Transformer Blocks 的形式？

## Transformer 的核心思想

Transformer 的核心思想可以概括为一句话：

> 用 Attention 机制，让序列中的每个 Token 都能根据上下文动态聚合其他 Token 的信息。

传统 RNN 需要按顺序处理 Token：

```text
Token 1 -> Token 2 -> Token 3 -> Token 4
```

Transformer 则可以在同一层中并行处理整个序列：

```text
[Token 1, Token 2, Token 3, Token 4] -> Self-Attention -> 上下文表示
```

这带来几个关键优势：

- 更适合 GPU 并行计算
- 更容易扩展到大规模模型
- 更擅长建模长距离依赖
- 可以通过堆叠层数不断提升表达能力
- 与大规模预训练天然契合

## 原始 Transformer 架构

原始 Transformer 是 Encoder-Decoder 架构，主要用于机器翻译。

```text
输入序列
  -> Encoder
  -> 上下文表示
  -> Decoder
  -> 输出序列
```

### Encoder

Encoder 负责理解输入序列。

典型组件：

- Self-Attention
- Feed Forward Network
- Residual Connection
- LayerNorm

### Decoder

Decoder 负责生成输出序列。

典型组件：

- Masked Self-Attention
- Cross-Attention
- Feed Forward Network
- Residual Connection
- LayerNorm

其中 Cross-Attention 用于让 Decoder 关注 Encoder 的输出。

## 现代 LLM 常用架构：Decoder-only

当前主流大语言模型大多采用 Decoder-only 架构，例如：

- GPT 系列
- LLaMA 系列
- Qwen 系列
- DeepSeek 系列
- Mistral 系列

Decoder-only 模型只保留生成侧结构，按从左到右的方式预测下一个 Token。

```text
Token Embedding
  -> Transformer Block 1
  -> Transformer Block 2
  -> ...
  -> Transformer Block N
  -> LM Head
  -> 下一个 Token 概率
```

它和原始 Transformer Decoder 的主要区别是：通常没有独立 Encoder，也没有 Encoder-Decoder Cross-Attention。

## Decoder-only LLM 的整体流程

以一句输入为例：

```text
大语言模型正在
```

模型处理流程可以理解为：

```text
1. Tokenizer
   文本 -> Token ID

2. Embedding
   Token ID -> 向量

3. 位置编码
   注入顺序和距离信息

4. Transformer Blocks
   多层上下文建模

5. Final Norm
   输出前归一化

6. LM Head
   hidden state -> vocab logits

7. 采样或选择
   logits -> 下一个 Token
```

如果下一个 Token 是“改变”，模型会把它拼到上下文后继续生成：

```text
大语言模型正在改变
```

然后重复同样流程，直到生成结束。

## 一个 Transformer Block 里有什么？

现代 Decoder-only LLM 的 Block 通常包含：

```text
输入 hidden states
  -> Norm
  -> Masked Self-Attention
  -> Residual Add
  -> Norm
  -> Feed Forward Network
  -> Residual Add
  -> 输出 hidden states
```

更简化地看：

```text
x = x + Attention(Norm(x))
x = x + FFN(Norm(x))
```

这就是很多现代 LLM 使用的 Pre-Norm Transformer Block。

## Self-Attention

Self-Attention 是 Transformer 最核心的模块。

它的作用是：让每个 Token 根据当前上下文，动态决定应该关注哪些 Token。

例如：

```text
小明把书放进书包，因为他明天要上课。
```

当模型处理“他”时，需要知道“他”大概率指的是“小明”。Attention 就是在做这种上下文关联建模。

在 Decoder-only LLM 中，Self-Attention 通常带有 Causal Mask，保证模型只能看到当前位置之前的 Token，不能偷看未来。

```text
当前位置只能关注：自己和之前的 Token
当前位置不能关注：未来 Token
```

Attention 的具体计算会在下一章 [Attention 机制深入解析](../README.md#4-attention-机制深入解析) 展开。

## Multi-Head Attention

单个 Attention 头只能从一个表示子空间里观察上下文。Multi-Head Attention 会并行使用多个 Attention 头。

直觉上，不同头可以关注不同关系：

- 语法关系
- 指代关系
- 局部上下文
- 长距离依赖
- 代码结构
- 标点和格式

例如，一个头关注主谓关系，另一个头关注括号匹配，还有一个头关注段落结构。

现代 LLM 中，Attention 还有多种变体：

- MHA：Multi-Head Attention
- MQA：Multi-Query Attention
- GQA：Grouped-Query Attention
- MLA：Multi-head Latent Attention

这些会在 Attention 章节进一步解释。

## Feed Forward Network

Attention 负责在 Token 之间传递信息，FFN 则负责对每个 Token 的表示做非线性变换。

典型 FFN 结构：

```text
hidden_size
  -> intermediate_size
  -> activation
  -> hidden_size
```

在 LLM 中，FFN 通常占据大量参数。很多模型的 FFN 中间维度会比 hidden size 大很多。

例如：

```text
hidden_size = 4096
intermediate_size = 11008
```

常见激活函数：

- GELU
- SiLU
- SwiGLU

现代 LLaMA、Qwen、DeepSeek 等模型常使用 SwiGLU 类结构。

## Residual Connection

Residual Connection 也叫残差连接。

它的形式很简单：

```text
输出 = 输入 + 模块变换结果
```

例如：

```text
x = x + Attention(x)
x = x + FFN(x)
```

残差连接的作用：

- 缓解深层网络训练困难
- 保留原始信息
- 让梯度更容易传播
- 支持堆叠更多层 Transformer Blocks

没有残差连接，几十层甚至上百层的大模型会更难稳定训练。

## LayerNorm 与 RMSNorm

Norm 的作用是稳定每一层的输入分布，让训练更平稳。

原始 Transformer 使用 LayerNorm。很多现代 LLM 使用 RMSNorm。

| 归一化方法 | 特点 | 常见模型 |
| --- | --- | --- |
| LayerNorm | 对均值和方差做归一化 | 原始 Transformer、BERT |
| RMSNorm | 只基于均方根归一化，更轻量 | LLaMA、Qwen、DeepSeek |

Norm 通常放在 Attention 和 FFN 前后，有两种常见结构：

### Post-Norm

原始 Transformer 更接近 Post-Norm：

```text
x = Norm(x + Attention(x))
x = Norm(x + FFN(x))
```

### Pre-Norm

现代 LLM 常用 Pre-Norm：

```text
x = x + Attention(Norm(x))
x = x + FFN(Norm(x))
```

Pre-Norm 在深层模型中通常更稳定，因此成为主流。

## 位置编码在 Transformer 中的位置

Self-Attention 本身并不知道 Token 的顺序。

如果不加入位置信息，下面两句话在模型看来会非常相似：

```text
我喜欢你
你喜欢我
```

位置编码用于告诉模型每个 Token 的顺序、距离和相对关系。

不同模型注入位置的方法不同：

- 原始 Transformer：Sinusoidal Position Encoding
- BERT：Learned Absolute Position Embedding
- LLaMA / Qwen：RoPE
- 一些长上下文模型：ALiBi、NTK Scaling、YaRN 等

位置编码会在 [位置编码](../位置编码/README.md) 章节深入展开。

## LM Head：从隐藏状态回到词表

Transformer Blocks 输出的是 hidden state，不是自然语言。

要预测下一个 Token，需要通过 LM Head 映射到词表空间：

```text
hidden state -> LM Head -> vocab logits
```

如果词表大小是 `100000`，那么每个位置会输出 `100000` 个 logits。

模型会根据这些 logits 选择或采样下一个 Token。

常见生成策略包括：

- Greedy Search
- Top-k Sampling
- Top-p Sampling
- Temperature

这些会在后续推理与生成章节展开。

## 张量形状直觉

假设：

```text
batch_size = 2
sequence_length = 8
hidden_size = 4096
vocab_size = 100000
```

各阶段形状大致是：

| 阶段 | 张量形状 | 含义 |
| --- | --- | --- |
| Token IDs | `[2, 8]` | 每个样本 8 个 Token ID |
| Embedding | `[2, 8, 4096]` | 每个 Token 一个 4096 维向量 |
| Transformer Blocks | `[2, 8, 4096]` | 形状不变，表示不断更新 |
| LM Head | `[2, 8, 100000]` | 每个位置对全词表打分 |
| Next Token Logits | `[2, 100000]` | 通常取最后一个位置预测下一个 Token |

理解张量形状，是读 LLM 代码最重要的基本功之一。

## 最小 PyTorch 伪代码

下面是一个极简版 Decoder-only Transformer Block，用来帮助理解结构，不代表完整高性能实现。

```python
import torch
import torch.nn as nn


class TransformerBlock(nn.Module):
    def __init__(self, hidden_size, num_heads, intermediate_size):
        super().__init__()
        self.attn_norm = nn.LayerNorm(hidden_size)
        self.attn = nn.MultiheadAttention(
            embed_dim=hidden_size,
            num_heads=num_heads,
            batch_first=True,
        )
        self.ffn_norm = nn.LayerNorm(hidden_size)
        self.ffn = nn.Sequential(
            nn.Linear(hidden_size, intermediate_size),
            nn.GELU(),
            nn.Linear(intermediate_size, hidden_size),
        )

    def forward(self, x, causal_mask=None):
        attn_input = self.attn_norm(x)
        attn_output, _ = self.attn(
            attn_input,
            attn_input,
            attn_input,
            attn_mask=causal_mask,
        )
        x = x + attn_output

        ffn_input = self.ffn_norm(x)
        x = x + self.ffn(ffn_input)
        return x
```

真实 LLM 会更复杂，例如：

- 使用 RoPE
- 使用 RMSNorm
- 使用 SwiGLU
- 使用 GQA / MQA / MLA
- 使用 FlashAttention
- 使用 KV Cache
- 支持张量并行和流水线并行

但核心结构仍然是：

```text
Attention + FFN + Residual + Norm
```

## Transformer 为什么能扩展成大模型？

Transformer 成为 LLM 主流架构，主要因为它具备几个工程和算法优势。

### 1. 高并行度

训练时可以并行处理整个序列，比 RNN 更适合 GPU / TPU。

### 2. 可堆叠

Transformer Block 可以重复堆叠，形成更深的网络。

### 3. 可扩展

可以通过增加层数、隐藏维度、注意力头数、训练数据和参数量提升能力。

### 4. 适配多任务

同一套架构可以处理文本生成、代码生成、问答、摘要、翻译、工具调用等任务。

### 5. 与预训练范式匹配

下一个 Token 预测任务非常适合大规模无监督文本预训练。

## 常见误区

### 1. Transformer 不等于 Attention

Attention 是 Transformer 的核心组件，但 Transformer 还包括 FFN、Norm、Residual、Embedding、LM Head 等模块。

### 2. Decoder-only 不代表只有一个 Decoder 层

Decoder-only 指的是架构类型，不是层数。现代 LLM 通常堆叠几十层甚至上百层 Transformer Blocks。

### 3. Attention 负责全部能力

Attention 负责上下文信息交互，FFN 也非常重要，并且通常占据大量参数。

### 4. Transformer 天然懂顺序

Transformer 本身不具备顺序感知能力，需要位置编码或位置相关机制。

### 5. 模型越深一定越好

模型能力受架构、数据、训练稳定性、算力、优化方法共同影响，不是简单堆层数就能无限提升。

## 核心组件表

| 组件 | 作用 | 后续重点 |
| --- | --- | --- |
| Token Embedding | 把 Token ID 映射为向量 | [Token 与 Embedding](../02_Token与Embedding/README.md) |
| Position Encoding | 注入顺序和距离信息 | [位置编码](../位置编码/README.md) |
| Self-Attention | 建模 Token 间关系 | 下一章 Attention |
| Multi-Head Attention | 从多个子空间关注上下文 | 下一章 Attention |
| FFN | 对每个 Token 表示做非线性变换 | 架构演进 / MoE |
| Residual Connection | 保留信息并稳定训练 | 深层网络训练 |
| LayerNorm / RMSNorm | 稳定每层输入分布 | 主流模型结构 |
| LM Head | 输出词表 logits | 推理与生成 |

## 学习建议

学习 Transformer 架构时，不建议一上来陷入所有公式。可以先抓住这条数据流：

```text
Token IDs
  -> Embedding
  -> 多层 Transformer Blocks
  -> Final Norm
  -> LM Head
  -> Next Token
```

然后再逐个拆开 Block：

```text
Norm -> Attention -> Residual
Norm -> FFN -> Residual
```

最后再深入 Attention 的 Q、K、V 计算细节。

## 推荐阅读

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [GPT-3: Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971)
- [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288)

## 小结

Transformer 是 LLM 的核心骨架。现代 Decoder-only LLM 可以概括为：

```text
Embedding
  -> Transformer Block x N
      -> Norm
      -> Masked Self-Attention
      -> Residual
      -> Norm
      -> FFN
      -> Residual
  -> Final Norm
  -> LM Head
  -> 下一个 Token
```

理解 Transformer 架构之后，再去学习 Attention、位置编码、MoE、推理优化和分布式训练，都会顺很多。

---

**上一章：**[Token 与 Embedding](../02_Token与Embedding/README.md)  
**下一章建议阅读：**[Attention 机制深入解析](../README.md#4-attention-机制深入解析)
