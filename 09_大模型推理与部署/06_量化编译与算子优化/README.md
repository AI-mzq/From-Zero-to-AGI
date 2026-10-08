# 06. 量化、编译与算子优化

> 推理优化的目标不是单纯降低精度，而是在质量约束下减少数据搬运、计算量和执行开销。

## 本章定位

本章建立量化、图编译、算子融合和 CUDA Graph 之间的关系。具体命令、硬件跑分和质量回归进入项目实战。

## 核心地图

```text
数值表示：BF16 / FP16 → FP8 / INT8 / INT4
计算图：动态图 → 图捕获、重写与编译
算子执行：多个 Kernel → 融合或专用 Kernel
启动开销：逐次提交 → CUDA Graph 重放
```

## 1. 量化在减少什么

量化用更低位宽表示权重、激活或 KV Cache，主要减少显存容量、内存带宽和部分计算成本。

| 类型 | 主要对象 | 典型收益与风险 |
| --- | --- | --- |
| Weight-only | 模型权重 | 降低权重显存和读取带宽；计算时可能需要反量化 |
| Weight + Activation | 权重与中间激活 | 有机会使用低精度计算单元；校准和兼容要求更高 |
| KV Cache Quantization | 请求运行时缓存 | 提高长上下文和并发容量；可能影响注意力质量 |

低位宽不保证自动加速。只有硬件、Kernel 和模型结构都支持时，理论压缩才能转化为实际收益。

## 2. PTQ 与 QAT

- **PTQ（训练后量化）**：在训练完成后校准或直接转换，成本较低，适合快速部署。
- **QAT（量化感知训练）**：训练时模拟量化误差，通常有更好的质量恢复能力，但需要训练流程。

部署前必须同时验证模型质量、延迟、吞吐、显存和兼容性，不能只检查文件大小。

## 3. 图编译

编译器尝试捕获模型计算图，并进行常量折叠、布局调整、算子选择、融合和代码生成。

动态输入、数据依赖分支和不断变化的形状可能引发 Graph Break 或重复编译。LLM Serving 中的批次和序列长度经常变化，因此“能够编译”和“稳定获得收益”不是同一件事。

## 4. 算子融合与专用 Kernel

算子融合把多个小操作合并，减少 Kernel 启动、中间结果写回和重复内存访问。Attention、GEMM、归一化、激活、RoPE、采样和 MoE 都可能使用专用实现。

FlashAttention 的核心价值是改变 Attention 的数据访问方式，减少高带宽内存读写；它不是改变 Attention 的数学结果，也不等于所有模型和形状都能获得相同收益。

## 5. CUDA Graph

CUDA Graph 记录一组相对稳定的 GPU 操作并重复提交，可以降低 CPU 与 Kernel Launch 开销。

它更适合形状和内存地址相对稳定的执行路径。动态形状、控制流、额外工作区和图缓存可能增加内存占用或触发回退。

## 6. 优化顺序

```text
确认性能基线与质量基线
  → 判断瓶颈是容量、带宽、计算还是启动开销
  → 选择量化、编译或 Kernel 优化
  → 单变量验证性能
  → 做质量与稳定性回归
```

如果 Profiling 没有指向算子瓶颈，不应把手写 CUDA/Triton Kernel 当作默认前置任务。

## 常见误区

- **位宽减半，速度就会翻倍。** 性能还受反量化、Kernel、硬件和通信影响。
- **量化只影响精度。** 它也可能影响模型支持、并行方式和缓存布局。
- **编译成功就代表更快。** Graph Break、重编译和动态形状可能抵消收益。
- **专用 Kernel 永远优于通用实现。** 收益取决于输入形状、硬件和维护成本。

## 本章速记

```text
量化：减少表示成本
编译：优化计算图
融合：减少启动和数据搬运
CUDA Graph：减少重复提交开销
所有优化都要同时验证质量、性能和稳定性
```

## 自检问题

1. Weight-only 与 KV Cache 量化分别减少什么？
2. 为什么低位宽模型不一定运行得更快？
3. 动态形状为什么会影响编译和 CUDA Graph？
4. 什么时候才值得进入 Kernel 级优化？

## 参考资料

- [TensorRT-LLM Quantization](https://nvidia.github.io/TensorRT-LLM/latest/features/quantization.html)
- [PyTorch torch.compile](https://docs.pytorch.org/docs/stable/generated/torch.compile.html)
- [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/index.html)
- [FlashAttention](https://arxiv.org/abs/2205.14135)

---

**上一章：**[推理引擎与运行时](../05_推理引擎与运行时/README.md)

**下一章：**[并行策略与分布式推理](../07_并行策略与分布式推理/README.md)
