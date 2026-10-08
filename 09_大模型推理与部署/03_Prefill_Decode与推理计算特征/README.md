# 03. Prefill、Decode 与推理计算特征

> 大模型生成不是一次完成的：先处理整段输入，再逐 Token 生成输出。

## 本章定位

本章只解释推理的两个核心阶段及其资源特征。采样算法的详细原理见[推理与生成基础](../../02_大语言模型基础/11_推理与生成/README.md)。

## 请求路径

```text
输入文本
  → Tokenization
  → Prefill：处理全部输入 Token，建立 KV Cache
  → 生成首个输出 Token
  → Decode：每轮生成一个新 Token，并更新 KV Cache
  → 命中停止条件
  → Detokenization 与流式返回
```

## 1. Tokenization

Tokenizer 把文本转换为 Token ID。系统真正处理的是 Token 数量，不是字符数。

同样长度的文字，在不同语言、Tokenizer 和内容下可能得到不同 Token 数，因此 Benchmark 应记录实际输入与输出 Token 分布。

## 2. Prefill

Prefill 一次处理当前请求的全部输入 Token，并为各层注意力生成初始 KV Cache。

| 特征 | 说明 |
| --- | --- |
| 输入 | 整段 Prompt Token |
| 输出 | 首个生成位置的结果与初始 KV Cache |
| 并行性 | 输入位置可以在一次前向计算中并行处理 |
| 主要指标 | TTFT |
| 常见瓶颈 | 长 Prompt、排队、计算量、显存和其他请求干扰 |

Prefill 通常具有更高的并行计算量，更容易使用 GPU 计算资源；但它也可能让正在 Decode 的请求等待，从而形成生成停顿。

## 3. Decode

Decode 是自回归循环：每轮读取已有 KV Cache，计算下一个 Token，再把新 Token 的 Key/Value 追加到缓存中。

```text
已有 Token 与 KV Cache
  → 执行一轮模型
  → 采样下一个 Token
  → 更新 KV Cache
  → 判断是否结束
  → 下一轮
```

| 特征 | 说明 |
| --- | --- |
| 单轮输入 | 每个活跃序列通常推进一个新 Token |
| 执行次数 | 与输出长度直接相关 |
| 主要指标 | TPOT / ITL、输出 Token 吞吐 |
| 常见瓶颈 | KV Cache 读取、显存带宽、小批次利用不足和调度干扰 |

Decode 单轮计算规模较小，但会重复很多次。对常见 Transformer 推理负载，它通常比 Prefill 更容易受内存访问效率影响；具体瓶颈仍取决于模型、批次、硬件和内核实现。

## 4. 两个阶段为什么难以同时优化

| 目标 | Prefill 偏好 | Decode 偏好 |
| --- | --- | --- |
| 提高设备利用率 | 尽量处理更多 Prompt Token | 聚合更多活跃序列一起生成 |
| 降低延迟 | 尽快准入新请求 | 避免长 Prefill 阻塞已有请求 |
| 控制显存 | Prompt 和批次不能无限增长 | 输出增长会持续扩大 KV Cache |

一个很长的 Prefill 如果整段执行，可能提高单次计算效率，却让已有 Decode 请求长时间收不到新 Token。调度器因此需要在 TTFT、TPOT 和总吞吐之间取舍。

## 5. 长度怎样影响系统

- **输入更长**：Prefill 工作量和初始 KV Cache 增加，TTFT 通常上升。
- **输出更长**：Decode 轮数增加，请求占用缓存和调度槽位的时间更长。
- **上下文持续增长**：每个新 Token 需要访问更长的历史缓存，单轮 Decode 成本可能上升。
- **请求长度差异大**：固定批次容易出现部分请求已结束、其他请求仍在运行的空闲槽位。

因此，压测只写“并发 32”不够，还必须记录输入与输出长度分布。

## 6. 流式输出改变了什么

流式输出让客户端尽早收到已经生成的内容，改善感知等待时间，但不会自动减少模型计算量。

它使系统能够直接观测 TTFT 和 Token 间隔，也增加了连接管理、网络传输和客户端测量边界等问题。

## 常见误区

- **Prefill 只影响 TTFT，Decode 只影响 TPOT。** 排队和混合调度会让两个阶段互相影响。
- **流式返回让模型生成更快。** 它主要改变结果交付方式。
- **Decode 每轮成本恒定。** 上下文、批次、缓存布局和硬件都会影响单轮成本。
- **字符长度可以代表计算量。** 系统实际处理的是 Token。

## 本章速记

```text
Prefill：一次处理输入，建立缓存，主要影响首 Token
Decode：多轮生成输出，持续读写缓存，主要影响后续 Token
调度器：在新请求 Prefill 与已有请求 Decode 之间分配资源
```

## 自检问题

1. Prefill 为什么能够并行处理 Prompt，而 Decode 必须多轮执行？
2. 输入长度和输出长度分别主要影响什么？
3. 长 Prefill 为什么可能让其他请求的 TPOT 变差？
4. 流式输出改善了什么，又没有改善什么？

## 参考资料

- [SARATHI: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills](https://arxiv.org/abs/2308.16369)
- [Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve](https://arxiv.org/abs/2403.02310)
- [NVIDIA NIM LLM Benchmarking Metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)

---

**上一章：**[性能指标与 Benchmark](../02_性能指标与Benchmark/README.md)

**下一章：**[KV Cache、批处理与请求调度](../04_KV_Cache批处理与请求调度/README.md)
