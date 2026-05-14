# 07_MoE 模型

> MoE（Mixture of Experts，混合专家模型）是一种用“稀疏激活”扩大模型总容量的架构路线：模型可以拥有很多专家，但每个 Token 只激活其中少数专家。

**原文解读链接🔗：**[详解 MoE 模型](http://mp.weixin.qq.com/s/qR6ExUarwvL6jbHK5qy_Rg?token=1354273325&lang=zh_CN)

**By：猫先生 of 「魔方AI空间」**

![alt text](../../imgs/魔方AI空间.png)

## 本章导读

在 Dense 模型中，每个 Token 通常都会经过同一套 FFN 参数。模型越大，推理时需要激活的参数也越多。

MoE 的思路不一样：

```text
模型内部有多个 Expert
  -> 每个 Token 通过 Router 选择少数几个 Expert
  -> 只激活被选中的 Expert
  -> 用更低的激活成本获得更大的模型容量
```

这也是为什么 Mixtral、DeepSeek-V2 / V3、Qwen-MoE 等模型会大量采用 MoE 架构。

本章重点回答：

- MoE 到底解决什么问题？
- Expert、Router、Top-k、Load Balance 分别是什么？
- Dense FFN 和 MoE FFN 有什么区别？
- 为什么 MoE 可以做到“总参数很大，激活参数较小”？
- MoE 训练为什么更难？
- MoE 推理部署为什么更复杂？
- Mixtral、DeepSeekMoE、Qwen-MoE 的技术取向有什么不同？

## 一句话理解 MoE

MoE 可以理解为：

> 把一个巨大的通用 FFN，拆成多个专长不同的 Expert；每个 Token 来了以后，由 Router 决定应该交给哪些 Expert 处理。

类比一下：

```text
Dense 模型：所有问题都交给同一个大团队处理
MoE 模型：先判断问题类型，再分配给少数几个专业小组处理
```

这样模型可以拥有更多总参数，但每次前向计算只使用其中一部分。

## Dense FFN 回顾

在普通 Transformer Block 中，结构通常是：

```text
x = x + Attention(Norm(x))
x = x + FFN(Norm(x))
```

其中 FFN 一般是：

```text
hidden_size
  -> intermediate_size
  -> activation
  -> hidden_size
```

Dense FFN 的特点是：每个 Token 都会经过同一个 FFN。

```text
Token A -> FFN
Token B -> FFN
Token C -> FFN
```

如果模型变大，FFN 参数也变大，每个 Token 的计算成本都会上升。

## MoE FFN 的核心变化

MoE 通常把 Transformer Block 中的 FFN 替换成多个 Expert。

```text
原始 FFN：
  一个大的 FFN

MoE FFN：
  Expert 1
  Expert 2
  Expert 3
  ...
  Expert N
```

每个 Expert 本质上通常也是一个 FFN，只是它们有各自独立的参数。

处理流程：

```text
Token hidden state
  -> Router 计算每个 Expert 的分数
  -> 选择 Top-k Experts
  -> Token 进入被选中的 Experts
  -> Expert 输出加权合并
  -> 返回 Transformer Block
```

## MoE 的基本结构

一个典型 MoE 层可以写成：

```text
输入 x
  -> Router(x)
  -> Top-k Experts
  -> Expert_1(x), Expert_2(x), ...
  -> 加权求和
  -> 输出 y
```

如果选择 Top-2：

```text
y = gate_1 * Expert_a(x) + gate_2 * Expert_b(x)
```

其中：

- `Expert_a`、`Expert_b` 是被选中的专家。
- `gate_1`、`gate_2` 是 Router 给出的权重。
- 没被选中的 Expert 不参与这个 Token 的计算。

## Expert 是什么？

Expert 通常是一个独立的 FFN。

例如一个普通 FFN：

```text
Linear(hidden_size -> intermediate_size)
Activation
Linear(intermediate_size -> hidden_size)
```

MoE 中每个 Expert 都可以有同样结构，但参数不同：

```text
Expert 1: FFN_1
Expert 2: FFN_2
Expert 3: FFN_3
...
Expert N: FFN_N
```

训练过程中，不同 Expert 可能逐渐形成不同偏好，例如：

- 某些 Expert 更擅长代码 Token
- 某些 Expert 更常处理数学表达式
- 某些 Expert 更常处理中文上下文
- 某些 Expert 更常处理格式、标点或结构化输出

但这种“专长”不是人工指定的，而是训练和路由共同形成的。

## Router 是什么？

Router 负责为每个 Token 分配 Expert。

它通常是一个很小的线性层：

```text
router_logits = x W_router
```

如果有 8 个 Expert，那么 Router 会为每个 Token 输出 8 个分数：

| Expert | Router Score |
| --- | ---: |
| Expert 1 | 0.10 |
| Expert 2 | 0.05 |
| Expert 3 | 0.60 |
| Expert 4 | 0.20 |
| Expert 5 | 0.01 |
| Expert 6 | 0.02 |
| Expert 7 | 0.01 |
| Expert 8 | 0.01 |

如果使用 Top-2 路由，这个 Token 可能会被送到：

```text
Expert 3 和 Expert 4
```

## Top-k 路由

Top-k 表示每个 Token 选择几个 Expert。

常见选择：

- Top-1：只激活 1 个 Expert
- Top-2：激活 2 个 Expert
- Top-k：激活 k 个 Expert

对比：

| 路由方式 | 优点 | 缺点 |
| --- | --- | --- |
| Top-1 | 计算更省，路由简单 | 表达能力和稳定性可能受限 |
| Top-2 | 效果和稳定性更好 | 计算和通信成本更高 |
| Top-k | 更灵活 | 实现和调度更复杂 |

Top-k 越大，每个 Token 激活的专家越多，能力可能更强，但推理成本也会更高。

## Gate 权重

Router 不只是选择 Expert，还会给被选中的 Expert 分配权重。

例如：

```text
Token x -> Top-2 Experts: Expert 3, Expert 4
gate_3 = 0.75
gate_4 = 0.25
```

最终输出：

```text
y = 0.75 * Expert_3(x) + 0.25 * Expert_4(x)
```

Gate 权重决定了每个 Expert 对最终输出的贡献。

## 稀疏激活

MoE 的关键优势来自稀疏激活。

假设模型有 64 个 Expert，每个 Token 只激活 2 个。

```text
总专家数：64
每个 Token 激活：2
激活比例：2 / 64 = 3.125%
```

这意味着：

- 总参数量可以很大
- 每次计算只用一小部分专家
- 模型容量和计算成本不再完全绑定

这就是 MoE 吸引人的地方。

## 总参数量与激活参数量

理解 MoE 时，一定要区分两个概念。

### 总参数量

模型拥有的全部参数，包括所有 Expert。

例如：

```text
总参数量 = 671B
```

### 激活参数量

单个 Token 前向计算实际用到的参数。

例如：

```text
激活参数量 = 37B
```

这意味着模型“储备”的容量很大，但每个 Token 实际计算只走一小部分路径。

这也是 MoE 和 Dense 模型最核心的区别之一。

## Dense vs MoE

| 维度 | Dense 模型 | MoE 模型 |
| --- | --- | --- |
| FFN 结构 | 单个共享 FFN | 多个 Expert FFN |
| 参数使用 | 每个 Token 使用主要参数路径 | 每个 Token 只激活部分 Expert |
| 总参数量 | 与计算成本强绑定 | 可大幅增加总容量 |
| 激活参数量 | 接近模型主要参数 | 远小于总参数量 |
| 训练难度 | 相对简单 | 路由、负载均衡更复杂 |
| 推理部署 | 相对直接 | 专家并行和通信复杂 |
| 代表模型 | LLaMA、Gemma、Phi | Mixtral、DeepSeek-V2/V3 |

一句话总结：

```text
Dense：所有 Token 走同一条主干
MoE：不同 Token 走不同专家路径
```

## 为什么 MoE 适合大模型？

### 1. 扩大模型容量

MoE 可以在不线性增加每个 Token 计算量的情况下，增加模型总参数量。

### 2. 提升专业化能力

不同 Expert 可能学习不同领域、语言、格式或推理模式。

### 3. 改善训练性价比

在同等计算预算下，MoE 可以获得更大的参数容量。

### 4. 支持多任务和多领域

不同 Token 可以被路由到不同专家，更适合多语言、代码、数学、工具调用等混合场景。

### 5. 适合规模化扩展

当 Dense 模型继续增大变得昂贵时，MoE 提供了另一条扩展路线。

## MoE 的训练难点

MoE 很强，但不好训练。

### 1. 负载不均衡

如果 Router 总是选择少数几个 Expert，就会出现：

```text
热门 Expert 过载
冷门 Expert 学不到东西
```

这会导致训练不稳定、专家浪费和吞吐下降。

### 2. Expert Collapse

某些 Expert 长期得不到 Token，逐渐变成无效专家。

这种现象类似“专家坍缩”。

### 3. 路由抖动

训练早期 Router 不稳定，Token 分配可能频繁变化，影响收敛。

### 4. 通信开销

在多 GPU / 多节点训练中，不同 Expert 可能分布在不同设备上。

Token 被路由到不同 Expert，会产生 All-to-All 通信。

### 5. 批处理效率

不同 Expert 收到的 Token 数不同，容易导致计算负载不均，降低硬件利用率。

## 负载均衡

为了避免少数 Expert 被过度使用，MoE 通常需要负载均衡机制。

常见方法包括：

- Auxiliary Load Balancing Loss
- Expert Capacity
- Router z-loss
- Token dropping / token padding
- Expert choice routing
- 无辅助损失的负载均衡策略

负载均衡的目标是：

```text
让不同 Expert 都能接收到足够 Token
  -> 避免热门 Expert 过载
  -> 避免冷门 Expert 闲置
  -> 保持训练吞吐和稳定性
```

## Expert Capacity

Expert Capacity 表示每个 Expert 在一个 batch 中最多接收多少 Token。

如果某个 Expert 被太多 Token 选中，就会超过容量。

可能处理方式：

- 丢弃溢出的 Token
- 把 Token 送到备选 Expert
- Padding 到统一大小
- 动态调度

Capacity 设计会影响：

- 训练稳定性
- 硬件利用率
- 路由质量
- 模型最终效果

## MoE 的推理部署难点

MoE 推理不是简单加载模型就结束了。

### 1. Expert 并行

Expert 太多时，不可能所有 Expert 都放在单卡上，需要分布到多张 GPU。

### 2. All-to-All 通信

Token 需要根据 Router 结果发送到对应 Expert，计算完成后再聚合回来。

这会引入通信瓶颈。

### 3. 负载不均

推理时如果大量 Token 被路由到同一 Expert，会导致局部 GPU 过载。

### 4. KV Cache 与 MoE 叠加

MoE 主要影响 FFN 路径，KV Cache 主要来自 Attention。

在长上下文推理中，两者会共同影响显存和吞吐。

### 5. 批量调度复杂

服务端推理需要同时处理多个请求，不同请求路由到不同 Expert，会增加调度复杂度。

## 典型 MoE 架构

### 1. Switch Transformer

代表论文：[Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)

特点：

- Top-1 路由
- 简化 MoE 训练
- 展示稀疏激活扩展到超大参数规模的潜力

### 2. GShard

代表论文：[GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding](https://arxiv.org/abs/2006.16668)

特点：

- 条件计算
- 自动分片
- 面向大规模多语言模型训练

### 3. Mixtral

代表论文：[Mixtral of Experts](https://arxiv.org/abs/2401.04088)

特点：

- Sparse MoE
- 每层多个 Expert
- 每个 Token 选择少数 Expert
- 开源 MoE 模型的重要代表

### 4. DeepSeekMoE

代表论文：[DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models](https://arxiv.org/abs/2401.06066)

DeepSeekMoE 强调更细粒度的专家划分和共享专家机制，目标是提高专家专业化程度。

核心思想包括：

- 细粒度专家
- 共享专家
- 专家专业化
- 更高效的参数利用

### 5. DeepSeek-V2 / V3

代表论文：

- [DeepSeek-V2](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437)

DeepSeek-V2 / V3 将 MoE 与 MLA 等高效架构结合，重点优化大模型训练和推理性价比。

重点关注：

- DeepSeekMoE
- MLA
- 大规模 MoE 训练
- 长上下文推理效率
- 高激活效率

## MoE 与 Attention 优化的关系

MoE 主要优化 FFN 部分，Attention 优化主要解决上下文交互和 KV Cache 问题。

可以这样理解：

```text
Attention 优化：
  解决 Token 之间如何高效交互

MoE 优化：
  解决每个 Token 如何使用更大模型容量
```

二者经常同时出现：

- GQA / MQA / MLA 降低 Attention 和 KV Cache 成本
- MoE 扩大 FFN 容量
- FlashAttention 提升 Attention 计算效率
- 专家并行提升 MoE 训练和推理吞吐

现代大模型往往不是单独靠某一个模块变强，而是多个优化叠加。

## MoE 与对齐训练

MoE 模型在后训练阶段也会带来额外挑战。

例如：

- SFT 时不同任务可能激活不同 Expert
- RLHF / GRPO 训练时路由稳定性会影响策略更新
- 长文本推理中不同位置的路由可能变化明显
- 专家负载不均可能影响训练吞吐

因此一些对齐算法会特别关注 MoE 场景下的稳定性。

在本项目的 [RLHF](../RLHF/README.md) 章节中，GSPO 就提到了面向 MoE 架构的适配问题。

## 一个简化版 MoE 伪代码

下面是一个帮助理解的极简伪代码，不代表高性能实现。

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class Expert(nn.Module):
    def __init__(self, hidden_size, intermediate_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(hidden_size, intermediate_size),
            nn.SiLU(),
            nn.Linear(intermediate_size, hidden_size),
        )

    def forward(self, x):
        return self.net(x)


class SimpleMoE(nn.Module):
    def __init__(self, hidden_size, intermediate_size, num_experts, top_k=2):
        super().__init__()
        self.router = nn.Linear(hidden_size, num_experts)
        self.experts = nn.ModuleList(
            [Expert(hidden_size, intermediate_size) for _ in range(num_experts)]
        )
        self.top_k = top_k

    def forward(self, x):
        # x: [batch, seq_len, hidden_size]
        router_logits = self.router(x)
        router_probs = F.softmax(router_logits, dim=-1)
        top_probs, top_indices = torch.topk(router_probs, self.top_k, dim=-1)

        output = torch.zeros_like(x)
        for expert_id, expert in enumerate(self.experts):
            mask = top_indices == expert_id
            if not mask.any():
                continue

            token_mask = mask.any(dim=-1)
            selected_x = x[token_mask]
            expert_output = expert(selected_x)

            expert_weights = (top_probs * mask.float()).sum(dim=-1)
            output[token_mask] += expert_output * expert_weights[token_mask].unsqueeze(-1)

        return output
```

真实 MoE 系统会复杂得多，需要处理：

- All-to-All 通信
- Expert 并行
- Capacity
- 负载均衡损失
- 混合精度
- Token dispatch / combine
- 分布式训练
- 推理服务调度

但核心逻辑仍然是：

```text
Router 选专家
  -> Expert 处理 Token
  -> Gate 加权合并
```

## 常见误区

### 1. MoE 不是多个完整模型投票

MoE 通常是在 Transformer 的 FFN 层替换成多个 Expert，而不是把多个完整 LLM 放在一起投票。

### 2. MoE 的总参数量不等于每次推理成本

MoE 要区分总参数量和激活参数量。每个 Token 只激活部分专家。

### 3. MoE 不一定天然更快

MoE 理论上计算更稀疏，但通信、调度、负载均衡可能让实际部署更复杂。

### 4. Expert 专长不是人工手写规则

Expert 的分工主要来自训练和路由学习，不是人工指定“这个专家管数学，那个专家管代码”。

### 5. MoE 不是 Dense 的全面替代

Dense 模型依然有结构简单、部署直接、稳定性好的优势。MoE 更适合大规模容量扩展场景。

## 核心概念表

| 概念 | 简单解释 | 关键作用 |
| --- | --- | --- |
| Expert | MoE 中的专家网络，通常是 FFN | 提供专业化参数容量 |
| Router | 为每个 Token 选择 Expert 的模块 | 决定 Token 走哪条路径 |
| Gate | 被选中 Expert 的权重 | 控制 Expert 输出贡献 |
| Top-k | 每个 Token 激活 k 个 Expert | 控制稀疏程度 |
| Sparse Activation | 只激活部分 Expert | 降低激活计算成本 |
| Load Balance | 让 Expert 使用更均衡 | 提高训练稳定性和吞吐 |
| Expert Capacity | 每个 Expert 可接收 Token 上限 | 控制批处理和通信 |
| All-to-All | Token 跨设备分发通信 | MoE 分布式训练核心开销 |
| Active Parameters | 单个 Token 实际使用参数 | 衡量推理计算成本 |
| Total Parameters | 模型拥有的全部参数 | 衡量模型总容量 |

## 学习建议

学习 MoE 时，建议抓住三条主线：

1. **结构主线**：FFN 被替换为多个 Expert。
2. **路由主线**：Router 为每个 Token 选择 Top-k Expert。
3. **工程主线**：负载均衡、通信、调度决定 MoE 能不能高效落地。

只要理解这三点，就能看懂 Mixtral、DeepSeekMoE、DeepSeek-V3 等模型报告中的大部分 MoE 架构描述。

## 推荐阅读

- [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538)
- [GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding](https://arxiv.org/abs/2006.16668)
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)
- [ST-MoE: Designing Stable and Transferable Sparse Expert Models](https://arxiv.org/abs/2202.08906)
- [Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models](https://arxiv.org/abs/2401.06066)
- [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437)

## 小结

MoE 的核心可以概括为：

```text
Dense FFN
  -> 多个 Expert FFN
  -> Router 为每个 Token 选择 Top-k Expert
  -> 只激活少数 Expert
  -> 用更低激活成本获得更大模型容量
```

MoE 是现代大模型扩展的重要路线，但它并不是免费的午餐。它用路由、负载均衡、专家并行和通信复杂度，换来了更大的参数容量和更高的训练/推理性价比。

---

**上一章：**[主流 LLM 架构演进](../06_主流LLM架构演进/README.md)  
**下一章建议阅读：**[LLM 预训练](../README.md#8-llm-预训练)
