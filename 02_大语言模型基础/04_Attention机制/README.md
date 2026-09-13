# 04_Attention 机制

> Attention 是 Transformer 的核心计算模块。它让每个 Token 都能根据上下文动态选择“应该关注谁”。

**原文解读链接🔗：**[手动求解 Transformer](https://blog.csdn.net/m_aigc2022/article/details/140260384?spm=1001.2014.3001.5502)

**By：猫先生 of 「魔方AI空间」**

![alt text](../../imgs/魔方AI空间.png)

## 本章导读

上一章我们从整体上理解了 Transformer 架构：

```text
Embedding
  -> Transformer Block x N
  -> LM Head
  -> 下一个 Token
```

而每个 Transformer Block 中最关键的模块，就是 Attention。

Attention 解决的问题是：

> 当前 Token 在理解上下文时，应该从哪些 Token 中获取信息？每个 Token 应该分配多少注意力权重？

例如：

```text
小明把书放进书包，因为他明天要上课。
```

当模型处理“他”时，需要知道“他”大概率指的是“小明”。Attention 就是在建模这种上下文依赖关系。

本章重点回答：

- Q、K、V 分别是什么？
- Attention Score 如何计算？
- 为什么需要除以根号 `d_k`？
- Softmax 在 Attention 中起什么作用？
- Causal Mask 为什么对自回归 LLM 必不可少？
- Multi-Head Attention 为什么有效？
- MHA、MQA、GQA、MLA 有什么区别？
- Attention 的计算复杂度为什么会成为长上下文瓶颈？
- KV Cache 为什么能加速推理？

## Attention 的一句话理解

Attention 可以理解为一个“按相关性加权求和”的过程。

```text
当前 Token 提出查询 Query
  -> 和所有 Key 计算相关性
  -> 得到注意力权重
  -> 对所有 Value 加权求和
  -> 得到当前 Token 的上下文表示
```

更直观地说：

```text
我要理解当前位置
  -> 我先问：哪些历史 Token 和我有关？
  -> 再根据相关程度，从它们那里取信息
```

## Q、K、V 是什么？

Attention 中最重要的三个对象是：

- Q：Query，查询
- K：Key，键
- V：Value，值

可以用信息检索来类比：

| 符号 | 类比 | 作用 |
| --- | --- | --- |
| Q | 搜索请求 | 当前 Token 想找什么信息 |
| K | 文档索引 | 每个 Token 可以被什么方式匹配 |
| V | 文档内容 | 每个 Token 真正提供的信息 |

对于输入 hidden states：

```text
x: [batch_size, sequence_length, hidden_size]
```

模型会用三个线性层分别投影出 Q、K、V：

```text
Q = x Wq
K = x Wk
V = x Wv
```

这三个矩阵不是人工设计的，而是在训练中学出来的参数。

## Scaled Dot-Product Attention

最经典的 Attention 计算叫 Scaled Dot-Product Attention。

核心流程：

```text
1. Q 和 K 做点积，得到相关性分数
2. 分数除以 sqrt(d_k)，避免数值过大
3. 加上 Mask，屏蔽不该看的位置
4. Softmax，把分数变成权重
5. 权重乘以 V，得到上下文表示
```

用伪公式表示：

```text
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k) + mask) V
```

其中：

- `QK^T`：计算每个 Query 和每个 Key 的相似度
- `sqrt(d_k)`：缩放因子
- `mask`：控制哪些位置可见
- `softmax`：把分数转成概率权重
- `V`：被加权汇总的信息

## 一个极简例子

假设句子有 4 个 Token：

```text
["小明", "喜欢", "机器", "学习"]
```

当模型处理“学习”时，它可能给不同 Token 分配注意力权重：

| 被关注 Token | 注意力权重 |
| --- | ---: |
| 小明 | 0.10 |
| 喜欢 | 0.20 |
| 机器 | 0.55 |
| 学习 | 0.15 |

最终“学习”的新表示不是只来自自己，而是所有 Value 的加权和：

```text
新表示 = 0.10 * V(小明)
       + 0.20 * V(喜欢)
       + 0.55 * V(机器)
       + 0.15 * V(学习)
```

这样模型就能知道这里的“学习”更像是“机器学习”这个短语的一部分，而不是普通动词。

## 为什么要除以 sqrt(d_k)？

Q 和 K 的维度越高，点积结果的数值范围通常越大。

如果直接把很大的分数送入 Softmax，可能会导致：

- Softmax 输出过于尖锐
- 某个位置权重接近 1
- 其他位置权重接近 0
- 梯度变得不稳定

因此 Transformer 会除以 `sqrt(d_k)` 做缩放，让分数保持在更稳定的范围。

这也是 “Scaled” Dot-Product Attention 中 “Scaled” 的来源。

## Softmax 的作用

Attention Score 本身只是原始相关性分数，不一定是概率。

Softmax 会把它转成一组权重：

- 每个权重都大于等于 0
- 所有权重加起来等于 1
- 分数越高，权重越大

例如：

```text
原始分数：[2.0, 1.0, 0.1]
Softmax 后：[0.66, 0.24, 0.10]
```

随后模型用这些权重对 V 做加权求和。

## Self-Attention

Self-Attention 指 Q、K、V 都来自同一个序列。

```text
Q = 当前序列投影得到
K = 当前序列投影得到
V = 当前序列投影得到
```

它让一个序列内部的 Token 彼此交互。

例如：

```text
Transformer 架构非常适合大规模训练。
```

在 Self-Attention 中，每个 Token 都可以根据上下文更新自己的表示。

## Causal Mask

Decoder-only LLM 是自回归模型，训练目标是预测下一个 Token。

因此在预测当前位置时，模型不能看到未来 Token。

例如训练句子：

```text
大语言模型正在改变世界
```

当模型预测“改变”时，只能看到：

```text
大语言模型正在
```

不能看到：

```text
世界
```

这就需要 Causal Mask。

## Causal Mask 长什么样？

假设序列长度为 5，允许关注的位置可以表示为：

```text
1 0 0 0 0
1 1 0 0 0
1 1 1 0 0
1 1 1 1 0
1 1 1 1 1
```

第 1 行只能看第 1 个 Token。

第 3 行可以看第 1、2、3 个 Token，但不能看第 4、5 个 Token。

这种下三角结构保证模型只能利用历史信息。

在实现中，被屏蔽的位置通常会加上一个非常大的负数：

```text
masked_score = -inf
```

经过 Softmax 后，这些位置的权重会变成 0。

## Padding Mask

除了 Causal Mask，还有 Padding Mask。

在 batch 训练中，不同样本长度不同，通常需要补齐：

```text
样本 A：[12, 53, 91, 7]
样本 B：[88, 21, pad, pad]
```

Padding Mask 用于告诉模型：

```text
pad 只是补齐符号，不应该参与 Attention
```

因此实际训练时可能同时存在：

- Causal Mask：屏蔽未来 Token
- Padding Mask：屏蔽补齐 Token

## Multi-Head Attention

Multi-Head Attention 会把 hidden size 切成多个头，每个头独立做 Attention。

假设：

```text
hidden_size = 4096
num_heads = 32
head_dim = 128
```

那么每个头负责一个 128 维子空间。

直觉上，不同头可以关注不同模式：

- 一个头关注近邻 Token
- 一个头关注主谓关系
- 一个头关注括号匹配
- 一个头关注代码缩进
- 一个头关注段落标题
- 一个头关注长距离指代

最后多个头的输出会拼接起来，再经过输出投影：

```text
head_1, head_2, ..., head_n
  -> concat
  -> output projection
```

## 张量形状直觉

假设：

```text
batch_size = 2
sequence_length = 8
hidden_size = 4096
num_heads = 32
head_dim = 128
```

常见形状如下：

| 张量 | 形状 | 含义 |
| --- | --- | --- |
| x | `[2, 8, 4096]` | 输入 hidden states |
| Q | `[2, 32, 8, 128]` | 每个头的 Query |
| K | `[2, 32, 8, 128]` | 每个头的 Key |
| V | `[2, 32, 8, 128]` | 每个头的 Value |
| Attention Scores | `[2, 32, 8, 8]` | 每个 Token 对每个 Token 的注意力分数 |
| Attention Weights | `[2, 32, 8, 8]` | Softmax 后的权重 |
| Attention Output | `[2, 32, 8, 128]` | 每个头的输出 |
| Merged Output | `[2, 8, 4096]` | 多头合并后的输出 |

这里最关键的是 Attention Scores 的形状：

```text
[batch_size, num_heads, sequence_length, sequence_length]
```

这也是 Attention 在长上下文下开销很大的根源。

## Attention 的复杂度

标准 Attention 需要计算每个 Token 和每个 Token 的关系。

如果序列长度是 `n`，那么 Attention Score 矩阵大小是：

```text
n x n
```

所以计算复杂度和显存开销大致与 `n^2` 相关。

例如：

| 序列长度 | Attention 矩阵规模 |
| ---: | ---: |
| 1,000 | 1,000,000 |
| 8,000 | 64,000,000 |
| 32,000 | 1,024,000,000 |
| 128,000 | 16,384,000,000 |

这就是长上下文模型需要优化 Attention 的原因。

常见优化方向：

- FlashAttention
- Sparse Attention
- Sliding Window Attention
- Ring Attention
- Linear Attention
- KV Cache
- MQA / GQA / MLA

## MHA、MQA、GQA、MLA

现代 LLM 为了降低推理成本，对 Attention 做了很多结构改造。

### 1. MHA

MHA（Multi-Head Attention）是标准多头注意力。

特点：

- 每个头都有自己的 Q、K、V
- 表达能力强
- KV Cache 占用较大

### 2. MQA

MQA（Multi-Query Attention）让多个 Query 头共享同一组 K、V。

特点：

- 大幅减少 KV Cache
- 推理更省显存
- 可能略微影响表达能力

### 3. GQA

GQA（Grouped-Query Attention）介于 MHA 和 MQA 之间。

特点：

- 多个 Query 头分成若干组
- 每组共享一组 K、V
- 在效果和效率之间折中
- LLaMA 2、LLaMA 3、Qwen 等模型常见

### 4. MLA

MLA（Multi-head Latent Attention）是 DeepSeek 系列中非常重要的注意力优化路线。

直觉上，它通过低维潜变量压缩 Key / Value 表示，从而降低 KV Cache 占用。

特点：

- 面向长上下文和高效推理
- 降低 KV Cache 压力
- 在现代 MoE / 高效 LLM 架构中很重要

MLA 的细节会在后续主流模型架构演进中进一步展开。

## KV Cache

自回归生成时，模型是一个 Token 一个 Token 地生成。

假设已经生成：

```text
大语言模型正在
```

下一步要预测“改变”。如果每一步都重新计算所有历史 Token 的 K、V，会非常浪费。

KV Cache 的思想是：

```text
历史 Token 的 K、V 已经算过
  -> 缓存起来
  -> 下一步只计算新 Token 的 Q、K、V
  -> 新 Token 的 Q 关注历史缓存的 K、V
```

这样可以显著加速推理。

## KV Cache 为什么占显存？

KV Cache 需要为每层、每个头、每个历史 Token 保存 K 和 V。

它的规模和这些因素相关：

- batch size
- sequence length
- number of layers
- number of kv heads
- head dimension
- 数据类型，例如 FP16 / BF16 / FP8

上下文越长，KV Cache 越大。

这也是为什么长上下文推理非常吃显存，以及为什么 MQA、GQA、MLA 等技术很重要。

## 极简 PyTorch 实现

下面是一个简化版 Scaled Dot-Product Attention，用于理解计算过程。

```python
import math
import torch
import torch.nn.functional as F


def scaled_dot_product_attention(q, k, v, mask=None):
    # q, k, v: [batch, heads, seq_len, head_dim]
    head_dim = q.size(-1)

    scores = torch.matmul(q, k.transpose(-2, -1))
    scores = scores / math.sqrt(head_dim)

    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))

    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, v)
    return output, weights
```

简化版 Multi-Head Attention 可以理解为：

```text
x
  -> linear 得到 Q/K/V
  -> reshape 成多头
  -> scaled dot-product attention
  -> concat 多头
  -> output projection
```

真实工程实现会考虑更多细节：

- FlashAttention
- RoPE
- Causal Mask 融合
- KV Cache
- 张量并行
- 混合精度
- 变长序列
- 分块计算

## Attention 可视化直觉

Attention 权重可以看成一个矩阵：

```text
行：当前正在更新的 Token
列：它可以关注的 Token
值：注意力权重
```

如果某一行在某一列权重很高，说明当前 Token 强烈关注那个历史 Token。

例如：

```text
小明 把 书 放进 书包 因为 他 明天 要 上课
```

“他”这一行可能对“小明”这一列有较高权重。

不过要注意：Attention 权重可以提供一定解释性，但不能简单等同于模型的完整推理过程。

## 常见误区

### 1. Attention 不是人类注意力

Attention 是一种数学加权机制，不等同于人类认知中的注意力。

### 2. Q、K、V 不是固定语义

Q、K、V 是训练出来的向量空间，不是人工指定的“问题、索引、答案”。

### 3. Attention 权重不等于最终解释

高 Attention 权重说明信息流相关，但不能完全解释模型为什么做出某个回答。

### 4. 多头不是简单重复

不同头可能学习不同关系，也可能存在冗余。模型训练会自动决定如何使用这些头。

### 5. 长上下文不只是把窗口变大

长上下文还涉及位置编码、Attention 复杂度、KV Cache、数据训练和检索能力等问题。

## 核心概念表

| 概念 | 简单解释 | 关键作用 |
| --- | --- | --- |
| Query | 当前 Token 的查询向量 | 决定要找什么 |
| Key | 每个 Token 的匹配向量 | 决定如何被关注 |
| Value | 每个 Token 的信息向量 | 提供实际信息 |
| Attention Score | Q 和 K 的相关性分数 | 决定关注强度 |
| Softmax | 把分数转成权重 | 形成概率分布 |
| Causal Mask | 屏蔽未来 Token | 保证自回归训练 |
| MHA | 标准多头注意力 | 表达能力强 |
| MQA | 多 Query 共享 K/V | 降低 KV Cache |
| GQA | 分组共享 K/V | 效果和效率折中 |
| MLA | 压缩 K/V 表示 | 面向高效长上下文 |
| KV Cache | 缓存历史 K/V | 加速自回归推理 |

## 学习建议

学习 Attention 时，建议分三层理解：

1. **直觉层**：当前 Token 根据相关性从上下文中取信息。
2. **计算层**：QK 点积 -> 缩放 -> Mask -> Softmax -> 加权 V。
3. **工程层**：MHA / GQA / KV Cache / FlashAttention 解决效率问题。

只要抓住这三层，后面学习位置编码、长上下文、推理部署和 DeepSeek MLA 都会更顺。

## 推荐阅读

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/abs/2307.08691)
- [Fast Transformer Decoding: One Write-Head is All You Need](https://arxiv.org/abs/1911.02150)
- [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)

## 小结

Attention 的核心流程可以概括为：

```text
输入 hidden states
  -> 线性投影得到 Q / K / V
  -> Q 和 K 计算相关性
  -> 缩放并加 Mask
  -> Softmax 得到注意力权重
  -> 权重加权 V
  -> 得到上下文表示
```

它是 Transformer 能够理解上下文关系的关键机制，也是长上下文和高效推理优化中最核心的瓶颈之一。

---

**上一章：**[Transformer 架构](../03_Transformer架构/README.md)  
**下一章建议阅读：**[位置编码](../05_位置编码/README.md)
