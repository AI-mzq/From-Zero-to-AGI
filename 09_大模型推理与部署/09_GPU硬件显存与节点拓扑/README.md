# 09. GPU 硬件、显存与节点拓扑

> GPU 数量只是资源规模，计算能力、显存、带宽和互联方式共同决定这些资源能否转化为有效推理能力。

## 本章定位

本章建立推理工程需要的 GPU 硬件直觉，不深入芯片设计或 CUDA 编程细节。

## 核心地图

```text
单 GPU
├── 计算：Tensor Core / SM
├── 存储：显存容量
└── 搬运：显存带宽

单节点多 GPU
├── PCIe
├── NVLink / NVSwitch
└── CPU、NUMA 与 NIC 位置
```

## 1. 计算能力与显存带宽

| 资源 | 主要回答 |
| --- | --- |
| 计算吞吐 | 单位时间可以完成多少矩阵和向量计算？ |
| 显存容量 | 模型权重、KV Cache、激活和工作区能否放下？ |
| 显存带宽 | 数据能多快进入计算单元？ |

Prefill 通常更容易利用并行计算；Decode 经常需要反复读取权重和 KV Cache，更容易受到内存访问效率影响。实际瓶颈仍取决于批次、模型结构、精度和 Kernel。

## 2. 显存由谁占用

```text
GPU Memory
├── 模型权重
├── KV Cache
├── 激活与临时张量
├── CUDA Graph / 编译缓存
├── 通信缓冲区
└── Runtime 与 Kernel 工作区
```

`模型文件大小 < GPU 显存` 不代表一定能运行。部署还要为运行时状态和峰值工作区保留空间。

## 3. PCIe、NVLink 与 NVSwitch

- **PCIe**：连接 CPU、GPU、NIC 和存储等设备，通用但带宽和拓扑受主板与 Root Complex 影响。
- **NVLink**：为支持的 GPU 提供高带宽点对点互联。
- **NVSwitch**：在单节点或 NVLink Fabric 中连接更多 GPU，提供更灵活的高带宽通信路径。

Tensor Parallel 需要频繁通信，通常比多副本部署更依赖 GPU 间互联。相同 GPU 数量在不同拓扑下可能得到完全不同的扩展效率。

## 4. CPU 与 NUMA

CPU 负责请求处理、Tokenization、调度、数据准备和部分通信。多路 CPU 服务器中，CPU 内存和 PCIe 设备属于不同 NUMA 节点。

如果进程、GPU、NIC 和内存跨 NUMA 访问，数据可能绕行远端 CPU Socket，增加延迟并降低带宽。部署时需要同时看 GPU 拓扑和 CPU/NIC 亲和性。

## 5. MIG 与共享 GPU

MIG 可以把支持的 GPU 划分成多个隔离实例，每个实例拥有规定的计算和显存资源。它适合需要隔离、确定资源边界或小模型共享大卡的场景。

切分后单实例资源更少，也可能限制模型大小、并行方式和弹性。MIG 解决的是硬件分区，不等同于时间片共享或应用层多租户。

## 6. 从症状判断资源方向

| 现象 | 优先检查 |
| --- | --- |
| 模型无法加载或高并发 OOM | 权重、KV Cache、工作区和显存碎片 |
| Decode TPOT 较高 | 显存带宽、KV 长度、批次和 Kernel |
| 多卡加速很差 | GPU 拓扑、通信量、并行切分和负载不均衡 |
| GPU 利用率低但请求很慢 | 排队、CPU、Tokenization、网络或小批次 |
| 延迟周期性抖动 | 温度/功耗限制、抢占、NUMA、后台任务或同步点 |

单一利用率无法完成归因，需要把服务、引擎和硬件指标关联起来。

## 常见误区

- **显存只存模型权重。** KV Cache 和运行时工作区可能占据大量显存。
- **同型号 GPU 的多卡性能相同。** 拓扑和 NIC 位置会改变通信路径。
- **GPU 利用率低一定是浪费。** 低并发交互服务可能首先满足延迟目标。
- **MIG 能让所有工作负载无损共享。** 分区会改变可用资源和部署约束。

## 本章速记

```text
算得动：计算能力
放得下：显存容量
喂得饱：显存带宽
扩得开：GPU 互联与节点拓扑
跑得稳：功耗、温度、NUMA 与隔离
```

## 自检问题

1. 为什么模型文件能放进显存仍可能 OOM？
2. TP 为什么比多副本更依赖 GPU 互联？
3. NUMA 如何影响 GPU 与 NIC 的数据路径？
4. MIG 与应用层多租户有什么区别？

## 参考资料

- [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/index.html)
- [CUDA Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html)
- [CUDA Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html)
- [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/)
- [NCCL GPU Troubleshooting](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html)

---

**上一章：**[模型服务化与流量治理](../08_模型服务化与流量治理/README.md)

**下一章：**[集群网络、存储与资源调度](../10_集群网络存储与资源调度/README.md)
