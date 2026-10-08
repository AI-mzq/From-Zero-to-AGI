# 07. 并行策略与分布式推理

> 分布式推理不是简单增加 GPU，而是把模型、请求和通信以合适方式分配到多个设备。

## 本章定位

本章快速建立 DP、TP、PP、EP、CP/SP 与 PD 分离的关系，重点理解它们分别解决什么问题、引入什么通信。

## 核心地图

```text
扩展请求容量：Data Parallel / 多副本
拆分单个模型：Tensor Parallel + Pipeline Parallel
拆分 MoE 专家：Expert Parallel
拆分长序列：Context / Sequence Parallel
拆分推理阶段：Prefill-Decode Disaggregation
```

## 1. 主要并行策略

| 策略 | 怎样切分 | 主要解决 | 主要代价 |
| --- | --- | --- | --- |
| DP | 多个副本处理不同请求 | 提高总并发与可用性 | 权重重复、需要路由和负载均衡 |
| TP | 将层内张量计算拆到多卡 | 单卡放不下或单层计算过大 | 高频集合通信，对拓扑敏感 |
| PP | 按层把模型拆成多个阶段 | 跨 GPU/节点容纳更大模型 | Pipeline Bubble、阶段不均衡 |
| EP | 将不同专家分配到不同设备 | 扩展 MoE 模型 | All-to-All 和专家负载不均衡 |
| CP/SP | 沿上下文或序列维度拆分 | 超长上下文和激活压力 | 实现与通信模式更复杂 |

不同框架对 CP、SP 的定义和实现可能不同，比较时应核对切分对象和通信过程。

## 2. 常见集合通信

| 操作 | 作用 | 常见场景 |
| --- | --- | --- |
| All-Reduce | 汇总各设备结果并同步给所有设备 | Tensor Parallel 部分计算 |
| All-Gather | 收集各设备分片 | 张量或序列结果拼接 |
| Reduce-Scatter | 汇总后再按分片分发 | 降低中间通信与存储 |
| All-to-All | 每个设备向其他设备交换不同数据 | Expert Parallel Token 路由 |

并行效率取决于计算与通信能否重叠，也取决于 PCIe、NVLink、NVSwitch 和跨节点网络拓扑。

## 3. 怎样选择 TP 与 PP

- 模型能放入单卡：优先单卡，避免不必要通信。
- 模型可放入单节点但单卡放不下：通常先评估 TP。
- 模型跨节点才能放下：可能需要组合 TP 与 PP。
- 节点内互联较弱或 GPU 数量无法均匀切分：PP 有时更容易适配，但需要评估流水线利用率。

这只是起点，最终仍要用目标模型、硬件拓扑和负载测量。

## 4. Prefill-Decode 分离

Prefill 与 Decode 的计算特征不同。PD 分离让两类阶段运行在不同 Worker 或资源池：

```text
请求 → Prefill Worker → 传输 KV Cache → Decode Worker → 输出
```

潜在收益是分别调优两类资源，并减少长 Prefill 对 Decode 的干扰；代价是 KV Cache 传输、路由、队列和故障处理更加复杂。

PD 分离只有在阶段干扰和资源利用收益超过传输与系统复杂度时才有价值。

## 5. 扩展效率

```text
扩展效率 = 实际加速比 / GPU 数量增长倍数
```

设备增加后，通信、同步、负载不均衡和串行部分会让收益低于线性。除了总吞吐，还应观察 TTFT、TPOT、尾延迟、通信占比和单请求成本。

## 常见误区

- **GPU 越多一定越快。** 小模型或低并发可能被通信开销主导。
- **TP 只解决显存问题。** 它同时改变单请求计算和通信路径。
- **DP 与 TP 可以互换。** DP 扩展副本容量，TP 拆分单个模型。
- **PD 分离天然优于混合部署。** KV 传输和跨池调度可能抵消收益。

## 本章速记

```text
DP 分请求
TP 分层内张量
PP 分模型层
EP 分专家
CP/SP 分长序列
PD 分推理阶段
```

## 自检问题

1. DP 与 TP 分别解决什么问题？
2. 为什么 TP 对 GPU 拓扑特别敏感？
3. MoE 为什么常使用 All-to-All？
4. PD 分离增加了哪条新的数据路径？

## 参考资料

- [vLLM Parallelism and Scaling](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
- [Megatron-LM](https://arxiv.org/abs/1909.08053)
- [NVIDIA NCCL Documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/)
- [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving](https://arxiv.org/abs/2401.09670)

## 深度阅读｜魔方AI空间

- [一文解析大模型分布式并行策略：DP、TP、PP、CP、EP、SP](https://mp.weixin.qq.com/s/IO9uXMbVTlPvjALRglKWCQ)
- [一文深度解析 Prefill-Decode 分离式部署架构](https://mp.weixin.qq.com/s/cSs4h8r4au9zMkrh60snAw)

---

**上一章：**[量化、编译与算子优化](../06_量化编译与算子优化/README.md)

**下一章：**[模型服务化与流量治理](../08_模型服务化与流量治理/README.md)
