# 02. 性能指标与 Benchmark

> 没有统一的指标、负载和测量边界，任何“更快”都缺少可比较的含义。

## 本章定位

本章建立推理服务的度量语言，重点解释指标关系和 Benchmark 公平性。压测脚本、原始数据和具体框架对比进入 `10_项目实战`。

## 核心地图

```text
用户等待
├── TTFT：多久看到第一个 Token
├── TPOT / ITL：后续 Token 多快到达
└── E2E Latency：整个请求多久完成

系统容量
├── Request Throughput：每秒完成多少请求
├── Token Throughput：每秒生成多少 Token
└── Goodput：每秒完成多少个满足 SLO 的请求
```

## 1. 延迟指标

| 指标 | 含义 | 主要受什么影响 |
| --- | --- | --- |
| TTFT | 请求发出到收到首个非空 Token 的时间 | 网络、排队、Tokenization、Prefill、首 Token 生成 |
| TPOT / ITL | 首 Token 之后，输出 Token 之间的平均间隔 | Decode、KV Cache、批处理、调度和显存带宽 |
| E2E Latency | 请求开始到完整响应结束的时间 | TTFT、输出长度、Decode 速度和传输 |

一种常见的流式测量定义是：

```text
TTFT = t_first_token - t_request_start
E2E  = t_last_token  - t_request_start
ITL  = (E2E - TTFT) / (output_tokens - 1)
```

不同工具可能对空响应块、首 Token、网络和客户端时间采用不同规则，比较前必须核对定义。TPOT 和 ITL 经常被近似视为同一指标，但具体公式仍应以工具文档为准。

## 2. 吞吐指标

| 指标 | 计算对象 | 适合回答 |
| --- | --- | --- |
| 请求吞吐 | 完成请求数 / 时间 | 服务每秒能处理多少任务？ |
| 输出 Token 吞吐 | 输出 Token 总数 / 时间 | 整个系统的生成能力是多少？ |
| 单请求 Token 速度 | 某请求输出 Token 数 / 生成时间 | 单个用户看到的生成速度如何？ |

系统 Token 吞吐高，不代表单个请求体验好。高并发可以提高总吞吐，同时让排队和单请求延迟上升。

## 3. 并发与请求率

| 负载方式 | 含义 | 常见用途 |
| --- | --- | --- |
| 并发数 | 同时存在多少个未完成请求 | 闭环压测，模拟固定数量客户端 |
| 请求率 | 每秒向系统发送多少个请求 | 开环压测，模拟独立到达流量 |

闭环模式下，请求完成得越慢，新请求发送得也越慢，可能隐藏过载。开环模式会继续按目标速率发请求，更容易观察排队增长和容量拐点。

## 4. Goodput

Throughput 统计所有完成请求；Goodput 只统计同时满足服务目标的成功请求，例如：

```text
TTFT ≤ 500 ms
ITL  ≤ 50 ms
请求成功且输出有效
```

```text
Goodput = 满足全部 SLO 的请求数 / 测试时间
```

Goodput 能避免一种误判：系统虽然完成了更多请求，但大量请求已经慢到不可接受。

## 5. P50、P95 与 P99

- **P50**：中位体验，适合观察典型请求。
- **P95**：95% 请求不超过该值，能看到明显尾部问题。
- **P99**：对排队、抖动和少数慢请求更敏感。

平均值可能掩盖长尾。在线服务至少应同时报告中位数和高分位数，并说明样本量。

## 6. 一个可比较的 Benchmark 需要固定什么

| 类别 | 至少记录 |
| --- | --- |
| 模型 | 模型与版本、精度/量化、最大上下文 |
| 引擎 | 框架版本、关键配置、并行方式 |
| 硬件 | GPU、数量、显存、CPU、内存、互联 |
| 负载 | 输入/输出长度分布、并发或请求率、到达模式 |
| 服务 | 流式/非流式、协议、超时、重试和成功条件 |
| 流程 | 预热、测试时长、重复次数、随机性 |
| 结果 | 延迟分位数、吞吐、Goodput、错误率和显存 |

只改变一个主变量，才能更可靠地解释性能变化。不同模型、输出长度或硬件下的结果不能直接归因于框架本身。

## 常见误区

- **只报 tokens/s。** 没说明是单请求还是系统吞吐，也没说明输入输出长度。
- **只测固定并发。** 没有观察请求率上升时的排队和容量拐点。
- **忽略失败请求。** 吞吐升高可能来自超时、截断或错误处理方式变化。
- **用平均值代替分布。** 平均延迟无法说明尾部体验。
- **改变多个变量。** 同时更换模型、量化和批处理后，无法判断收益来自哪里。

## 本章速记

```text
用户体验：TTFT + TPOT / ITL + E2E
系统容量：请求吞吐 + Token 吞吐
有效容量：Goodput + 成功率
尾部风险：P95 / P99
```

## 自检问题

1. TTFT 和 TPOT 分别对应请求的哪个阶段？
2. 为什么系统 Token 吞吐高，不代表单用户生成更快？
3. 开环请求率为什么更容易暴露系统过载？
4. Goodput 比 Throughput 多约束了什么？
5. 做框架对比时，哪些变量必须固定？

## 参考资料

- [NVIDIA NIM LLM Benchmarking Metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)
- [NVIDIA AIPerf Metrics Reference](https://docs.nvidia.com/aiperf/reference/ai-perf-metrics-reference)
- [NVIDIA GenAI-Perf](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html)

---

**上一章：**[推理系统基础](../01_推理系统基础/README.md)

**下一章：**[Prefill、Decode 与推理计算特征](../03_Prefill_Decode与推理计算特征/README.md)
