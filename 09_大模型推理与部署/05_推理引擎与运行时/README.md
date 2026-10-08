# 05. 推理引擎与运行时

> 推理引擎把模型执行、缓存管理和请求调度组合起来，运行时则负责把计算真正落到设备与算子上。

## 本章定位

本章建立推理框架的统一观察维度。框架会更新，但请求流、缓存、调度、执行和服务接口这些问题长期存在。

## 核心架构

```text
Client / API
  → Router / Tokenizer
  → Queue / Scheduler
  → KV Cache Manager
  → Model Runner
  → Runtime / Kernels
  → GPU / Accelerator
```

不同框架可能合并或拆分这些组件，名称也不完全相同，应按职责理解。

## 1. Server、Engine 与 Runtime

| 层级 | 主要职责 |
| --- | --- |
| Model Server | 接收请求、处理协议、流式返回和错误 |
| Inference Engine | 调度请求、组织批次、管理 KV Cache 和模型执行 |
| Runtime | 加载模型、选择后端、执行计算图和设备算子 |
| Kernels | 完成 Attention、GEMM、MoE、采样等具体计算 |

一个框架可以同时承担多层职责，因此“引擎”和“运行时”在项目文档中可能存在术语重叠。

## 2. 一次请求经过哪些组件

1. API 层校验请求并应用聊天模板。
2. Tokenizer 将输入转成 Token ID。
3. Scheduler 根据显存、Token Budget 和优先级构造批次。
4. KV Cache Manager 分配或复用缓存块。
5. Model Runner 执行 Prefill 或 Decode。
6. Detokenizer 将结果转换为文本并流式返回。

性能差异通常来自整条链路的共同设计，而不是某一个算子。

## 3. 统一比较维度

| 维度 | 需要确认的问题 |
| --- | --- |
| 模型与硬件 | 支持哪些架构、精度和加速设备？ |
| 缓存 | 如何管理 KV Cache、前缀复用和卸载？ |
| 调度 | 如何组织 Prefill、Decode 和 Continuous Batching？ |
| 执行 | 使用哪些 Attention、GEMM、MoE 或采样实现？ |
| 并行 | 支持哪些单机、多卡和多机策略？ |
| 服务 | API、流式输出、多租户和扩缩容能力如何？ |
| 运维 | 指标、日志、Tracing、部署升级和故障恢复是否完整？ |

## 4. 代表性实现

| 实现 | 主要定位 | 适合观察的设计 |
| --- | --- | --- |
| vLLM | 通用高吞吐 LLM/VLM 推理与服务 | Paged KV、调度、Continuous Batching、分布式 Serving |
| SGLang | 面向 LLM/VLM 的高性能 Runtime 与应用前端 | Radix Cache、请求调度、结构化生成与运行时协同 |
| TensorRT-LLM | 面向 NVIDIA GPU 的推理优化与运行时 | 量化、编译、Kernel、并行和硬件特化 |
| TGI | Hugging Face 文本生成服务栈 | Router、模型服务与分片架构 |
| llama.cpp | 本地和资源受限环境推理 | CPU/GPU 混合执行、量化和可移植性 |

这些实现不是简单的“快慢排名”。模型、硬件、负载、精度和运维要求变化后，结论也可能变化。

> 截至 2026-10-08，Hugging Face 官方文档已将 TGI 标记为 maintenance mode；它仍适合作为服务架构参考，但新项目需要重新评估选型。

## 5. 选型顺序

```text
明确模型和硬件
  → 固定输入/输出长度与到达模式
  → 定义 TTFT、TPOT、Goodput 和成本目标
  → 核验模型、量化和并行支持
  → 用统一负载实测
  → 再评估部署与运维复杂度
```

先确认“能否正确运行”，再比较“是否满足 SLO”，最后才是峰值吞吐。

## 常见误区

- **支持 OpenAI API 就代表能力相同。** 相同协议背后可能有不同调度、缓存和模型支持。
- **单个吞吐数字可以决定选型。** 不同负载和硬件下的结果不可直接迁移。
- **框架支持某项特性就一定适合生产。** 还要核验稳定性、观测、升级和故障处理。
- **参数越多越灵活。** 参数之间存在耦合，过度调优会增加运维风险。

## 本章速记

```text
Server 管请求
Engine 管批次、缓存与执行
Runtime 管计算图和设备
Kernel 完成具体算子
框架选型必须回到模型、负载、SLO 和运维约束
```

## 自检问题

1. Server、Engine 和 Runtime 的职责有什么区别？
2. 为什么框架比较必须固定模型、硬件和负载？
3. 峰值吞吐之外还应比较哪些维度？
4. 为什么不应把框架名称作为一级知识骨架？

## 参考资料

- [vLLM Documentation](https://docs.vllm.ai/)
- [SGLang Documentation](https://docs.sglang.ai/)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [Text Generation Inference Architecture](https://huggingface.co/docs/text-generation-inference/en/architecture)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)

---

**上一章：**[KV Cache、批处理与请求调度](../04_KV_Cache批处理与请求调度/README.md)

**下一章：**[量化、编译与算子优化](../06_量化编译与算子优化/README.md)
