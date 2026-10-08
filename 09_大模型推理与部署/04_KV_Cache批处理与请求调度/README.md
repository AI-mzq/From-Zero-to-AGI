# 04. KV Cache、批处理与请求调度

> 高并发推理的核心不是让单个请求重复算得更快，而是高效保存历史计算，并持续组合不同阶段的请求。

## 本章定位

本章建立 KV Cache、分页管理、前缀复用、Continuous Batching、Chunked Prefill 和调度之间的关系，不穷举具体框架参数。

## 核心地图

```text
请求历史
  → KV Cache：避免重复计算历史 Key / Value
  → Paged KV：按块管理动态增长的缓存
  → Prefix Cache：复用相同前缀对应的缓存块

多个请求
  → Continuous Batching：按迭代动态加入和移除请求
  → Chunked Prefill：把长 Prefill 切成较小块
  → Scheduler：在延迟、吞吐、显存和公平性之间决策
```

## 1. KV Cache

自回归 Decode 每轮只新增一个 Token，但新 Token 需要关注之前的上下文。KV Cache 保存历史 Token 在各层注意力中的 Key 和 Value，避免每轮重新计算全部历史表示。

单个序列的 KV Cache 可以用下面的公式做近似估算：

```text
KV bytes ≈ 2 × layers × tokens × kv_heads × head_dim × bytes_per_element
```

其中 `2` 表示 Key 和 Value。使用 GQA/MQA、KV 量化、滑动窗口或混合注意力后，实际占用会变化，应以模型配置和引擎测量为准。

KV Cache 会随序列长度和并发增长，往往成为限制可同时服务请求数的重要显存资源。

## 2. 为什么需要分页管理

不同请求的输入和输出长度无法提前准确知道。若为每个请求预留一大块连续显存，容易出现：

- 预留但未使用的内部浪费；
- 请求结束后形成的碎片；
- 难以扩展或共享缓存空间。

PagedAttention 类方法把 KV Cache 切成固定大小的逻辑块，再映射到物理显存块。请求逻辑上保持连续，物理存储不必连续，从而更灵活地分配、释放和共享缓存。

分页管理解决的是缓存布局和内存管理问题，不等于自动解决批处理、调度和所有注意力计算问题。

## 3. Prefix Cache

如果多个请求具有完全相同的 Token 前缀，系统可以复用该前缀已经计算出的 KV Cache，减少重复 Prefill。

适合场景包括：

- 相同系统提示词；
- 多轮对话中的稳定历史；
- 同一文档前缀上的多个问题；
- 固定模板和少量变化输入。

Prefix Cache 通常要求 Token 级前缀一致。它不是“语义相似缓存”，也不能保证任意相似问题都复用结果。

## 4. Static Batching 与 Continuous Batching

| 方式 | 批次何时变化 | 主要问题或收益 |
| --- | --- | --- |
| Static Batching | 一批请求全部结束后再换批 | 短请求结束后可能留下空槽位 |
| Continuous Batching | 在生成迭代边界动态加入、移除请求 | 提高设备利用率，但调度更复杂 |

生成请求的输出长度不同。Continuous Batching 允许已完成请求退出，并让等待请求进入当前执行集合，避免整个批次被最长请求拖住。

这一思想也常被称为迭代级调度：调度粒度从“完整请求”缩小到“生成迭代”。

## 5. Chunked Prefill

长 Prompt 的 Prefill 如果一次执行，可能长时间占用设备并阻塞正在 Decode 的请求。Chunked Prefill 将 Prefill 拆成多个 Token 块，使调度器可以把部分 Prefill 与 Decode 请求组合执行。

主要目标：

- 限制单次 Prefill 对 Decode 延迟的干扰；
- 让每轮批次的 Token 工作量更可控；
- 在吞吐和 Token 间延迟之间取得更平滑的取舍。

块越小，调度更灵活，但拆分和重复调度开销可能增加；块越大，Prefill 效率可能更高，但更容易造成 Decode 停顿。

## 6. Scheduler 在决定什么

调度器通常要回答：

1. 哪些新请求可以进入系统？
2. 当前轮执行哪些 Prefill、Decode 或混合任务？
3. 批次的 Token 和序列数量是否超过预算？
4. KV Cache 不足时等待、抢占、换出还是拒绝？
5. 如何兼顾吞吐、延迟、公平性和优先级？

因此，最大活跃序列数、每轮 Token Budget 和可用 KV Cache 容量不是孤立约束，它们共同决定调度器能构造什么批次。

## 7. 关键取舍

| 调整方向 | 可能收益 | 可能代价 |
| --- | --- | --- |
| 增大批次/并发 | 提高系统吞吐 | 排队、TPOT 和尾延迟上升 |
| 增加 KV Cache 空间 | 容纳更多或更长请求 | 留给权重、激活和工作区的显存减少 |
| 启用前缀缓存 | 减少重复 Prefill | 命中依赖前缀一致性，也需要缓存管理 |
| 缩小 Prefill Chunk | 降低 Decode 停顿 | 调度次数和管理开销增加 |
| 允许抢占/换出 | 缓解显存压力 | 请求恢复成本和延迟上升 |

不存在对所有负载都最优的配置。参数必须结合输入长度、输出长度、到达模式和 SLO 测量。

## 常见误区

- **KV Cache 是模型权重的一部分。** 它是随请求产生和增长的运行时状态。
- **PagedAttention 会减少所有显存。** 它主要改善 KV Cache 的分配、碎片和共享，模型权重仍然存在。
- **Prefix Cache 是回答缓存。** 它复用的是前缀计算，不是直接返回语义答案。
- **批次越大越好。** 吞吐可能提高，但等待和尾延迟也可能恶化。
- **Continuous Batching 与 Paged KV 是同一件事。** 前者是调度方式，后者是缓存管理方式，两者可以协同但概念不同。

## 本章速记

```text
KV Cache：保存历史计算
Paged KV：灵活管理缓存块
Prefix Cache：复用相同前缀
Continuous Batching：动态维护执行批次
Chunked Prefill：限制长输入对 Decode 的干扰
Scheduler：把这些能力组合成可执行决策
```

## 自检问题

1. KV Cache 为什么会随上下文和并发增长？
2. Paged KV 主要解决什么内存问题？
3. Prefix Cache 和语义缓存有什么区别？
4. Continuous Batching 为什么比固定批次更适合生成任务？
5. Chunked Prefill 的块大小为什么存在取舍？

## 参考资料

- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu)
- [Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve](https://arxiv.org/abs/2403.02310)
- [vLLM Documentation](https://docs.vllm.ai/)

---

**上一章：**[Prefill、Decode 与推理计算特征](../03_Prefill_Decode与推理计算特征/README.md)

**返回：**[大模型推理与部署](../README.md)
