# 11. 可观测性、容量规划与成本

> 可观测性的目标不是收集最多指标，而是把用户体验、引擎行为和 GPU 状态连接成可解释的因果链。

## 本章定位

本章建立推理服务的观测分层、容量估算和成本指标，完整监控配置、看板与故障演练进入项目实战。

## 核心地图

```text
用户层：TTFT、TPOT、E2E、错误率
  ↓
服务层：请求率、队列、并发、超时、Goodput
  ↓
引擎层：批次、Token、KV Cache、抢占、Prefix 命中
  ↓
硬件层：GPU、显存、带宽、功耗、温度、通信、错误
```

只观察其中一层，通常无法解释“为什么慢”。

## 1. Metrics、Logs 与 Traces

| 信号 | 主要回答 |
| --- | --- |
| Metrics | 系统现在有多快、多忙、多稳定？ |
| Logs | 某个事件发生了什么，包含哪些上下文？ |
| Traces | 一个请求经过了哪些组件，各阶段耗时多少？ |
| Profiles | CPU、GPU、Kernel 和通信时间花在哪里？ |

指标适合发现异常，Trace 和日志适合定位请求路径，Profile 用于进入代码、算子和通信层归因。

## 2. 四层指标

| 层级 | 代表指标 |
| --- | --- |
| 用户 | TTFT、TPOT/ITL、E2E、P95/P99、成功率 |
| 服务 | RPS、并发、队列长度、排队时间、超时、Goodput |
| 引擎 | Prefill/Decode Token、批次大小、KV 使用率、缓存命中、抢占 |
| GPU/节点 | SM/显存利用率、显存容量、功耗、温度、PCIe/NVLink、ECC/Xid |

指标名称和单位可能随框架版本变化，应先确认定义，再建立跨层关联。

## 3. SLI、SLO 与告警

- **SLI**：实际测量的服务指标，例如 P95 TTFT。
- **SLO**：希望达到的目标，例如 99% 请求 TTFT 不超过某阈值。
- **告警**：当错误预算、容量或健康状态出现风险时触发行动。

告警应尽量指向用户影响和可执行动作。单纯“GPU 利用率高”不一定需要告警；如果同时出现队列增长、TTFT 恶化和 Goodput 下降，问题才更明确。

## 4. 容量规划

容量规划需要固定模型、硬件、精度、负载分布和 SLO，然后测量单副本 Goodput。

一个简化估算是：

```text
所需副本数 ≈ 峰值请求率 / 单副本可持续 Goodput × 安全余量
```

还需要检查：

- KV Cache 能否容纳目标并发和上下文；
- 长短请求混合后尾延迟是否恶化；
- 故障、升级或扩容期间是否仍有冗余；
- 模型加载和冷启动能否跟上流量变化。

容量不是峰值跑分，而是在目标 SLO 下可以持续提供的有效能力。

## 5. 成本指标

| 指标 | 适合回答 |
| --- | --- |
| GPU 小时成本 | 占用资源需要多少费用？ |
| 每请求成本 | 不同业务任务的平均服务成本是多少？ |
| 每百万 Token 成本 | 输入与输出规模变化后成本如何比较？ |
| 满足 SLO 的单位成本 | 为可接受体验支付了多少资源？ |

只降低 GPU 使用量不一定降低总成本。更慢的服务可能增加副本数量、排队、失败重试和用户等待。

## 6. 故障归因路径

```text
确认用户症状与影响范围
  → 查看请求率、队列、错误率和分位延迟
  → 拆分排队、Prefill、Decode 与传输时间
  → 关联 KV Cache、批次、通信与 GPU 状态
  → 用日志、Trace 或 Profile 验证假设
  → 修复后进行同负载回归
```

先提出可证伪的瓶颈假设，再选择指标和工具，避免在大量看板中无目标搜索。

## 常见误区

- **指标越多，可观测性越好。** 没有定义、关联和行动方式的指标只会增加噪声。
- **平均值足以描述服务。** 在线系统需要关注 P95/P99 和错误分布。
- **GPU 利用率可以直接代表容量。** 显存、队列、SLO 和通信可能先成为限制。
- **成本只看 GPU 单价。** 有效吞吐、可用性、冷启动和运维成本同样重要。

## 本章速记

```text
Metrics 发现问题
Logs / Traces 定位请求路径
Profiles 进入执行细节
Goodput 定义有效容量
SLO 下的单位成本决定真实效率
```

## 自检问题

1. 为什么 GPU 指标必须与服务指标关联？
2. SLI、SLO 和告警分别是什么？
3. 为什么容量规划应该使用 Goodput，而不是峰值吞吐？
4. 每百万 Token 成本还缺少哪些服务质量信息？

## 参考资料

- [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry Signals](https://opentelemetry.io/docs/concepts/signals/)
- [NVIDIA AIPerf Metrics Reference](https://docs.nvidia.com/aiperf/reference/ai-perf-metrics-reference)
- [NVIDIA DCGM Documentation](https://docs.nvidia.com/datacenter/dcgm/latest/)
- [DCGM Exporter Metrics](https://docs.nvidia.com/datacenter/dcgm/latest/reference/dcgm-exporter-metrics.html)

---

**上一章：**[集群网络、存储与资源调度](../10_集群网络存储与资源调度/README.md)

**返回：**[大模型推理与部署](../README.md)
