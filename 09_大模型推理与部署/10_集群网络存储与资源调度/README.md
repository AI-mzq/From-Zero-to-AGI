# 10. 集群网络、存储与资源调度

> GPU 集群的作用不是把卡集中起来，而是让模型、数据、通信和任务在正确的时间到达正确的设备。

## 本章定位

本章建立多节点推理所需的网络、存储、容器和资源调度关系，不展开完整 Kubernetes、Slurm 或云平台教程。

## 核心地图

```text
模型与镜像存储
  → 节点下载与启动
  → 调度器分配 GPU、CPU、内存和网络
  → 容器建立一致运行环境
  → NCCL 在 GPU 间通信
  → 服务路由接入流量
```

## 1. 节点内与节点间通信

| 范围 | 常见路径 | 主要影响 |
| --- | --- | --- |
| 节点内 | PCIe、NVLink、NVSwitch | TP、模型加载和 GPU 间同步 |
| 节点间 | Ethernet、InfiniBand、RoCE | 多机并行、KV 传输和扩展效率 |

跨节点通信通常比节点内通信更慢、抖动更大。并行策略应尽量把高频通信放在带宽更高、延迟更低的拓扑范围内。

## 2. NCCL 与集合通信

NCCL 为多 GPU 提供 All-Reduce、All-Gather、Reduce-Scatter、Broadcast 和 All-to-All 等集合通信。

NCCL 会根据可见设备、拓扑和网络选择通信路径，但自动选择不保证一定最优。设备可见性、容器权限、网卡选择、PCIe ACS、P2P 状态和网络配置都可能影响结果。

## 3. RDMA、InfiniBand 与 RoCE

- **RDMA**：让设备在更少 CPU 参与下直接访问远端内存。
- **InfiniBand**：为高性能计算设计的网络体系。
- **RoCE**：在以太网上承载 RDMA，需要合适的网络配置和拥塞管理。
- **GPUDirect RDMA**：在条件满足时，让 GPU 与远端网络设备之间减少主机内存中转。

低延迟网络只有在通信确实是瓶颈时才会转化为端到端收益。

## 4. 模型存储与加载

| 存储方式 | 优点 | 主要限制 |
| --- | --- | --- |
| 节点本地 NVMe | 加载快、运行时稳定 | 需要预热、同步和容量管理 |
| 共享文件系统 | 多节点看到统一路径 | 并发读取可能形成热点 |
| 对象存储 | 容量大、版本管理方便 | 启动前通常需要下载或缓存 |
| 镜像内置权重 | 环境和权重绑定 | 镜像巨大、升级和分发成本高 |

大模型冷启动可能被权重下载、反序列化、量化转换和 GPU 初始化主导。扩容时间不能只看容器启动时间。

## 5. 容器与运行环境

容器用于固定 Python 包、推理框架和系统依赖，但 GPU Driver 通常由宿主机提供。需要关注：

- Driver、CUDA Runtime、框架和通信库兼容性；
- GPU、共享内存、IPC、网络设备和挂载权限；
- 多节点镜像与模型版本一致性；
- 运行时安全边界和最小权限。

“镜像能启动”不等于多卡通信、Profiling 和硬件指标都可用。

## 6. GPU 资源调度

调度器至少要匹配 GPU 数量、型号、显存、节点标签和健康状态。更复杂的场景还需要：

- 多卡任务的同时分配（Gang Scheduling）；
- 拓扑感知与同节点优先；
- MIG 或其他分区资源；
- 配额、优先级、抢占和租户隔离；
- 故障 GPU 隔离与节点排空。

Kubernetes Device Plugin 等机制负责把 GPU 暴露为可调度资源，但“分配到 GPU”不代表自动获得最优拓扑。

## 7. 常见故障链

```text
模型启动慢
  → 检查存储、下载、反序列化和 GPU 初始化

多机性能差
  → 检查并行切分、NCCL 路径、NIC、RDMA 和拓扑

任务等待久
  → 检查 GPU 碎片、配额、Gang Scheduling 和资源规格
```

## 常见误区

- **高速网络会自动提高所有推理性能。** 单卡或低通信负载可能几乎不受益。
- **共享存储可以无限并发读取。** 大量副本同时加载权重可能形成启动风暴。
- **容器解决了全部环境一致性。** Driver、设备插件和宿主机内核仍在容器外。
- **调度器知道最优 GPU 拓扑。** 需要额外的标签、策略或拓扑感知能力。

## 本章速记

```text
网络决定跨设备数据怎么走
存储决定模型多快到达节点
容器决定软件环境是否一致
调度决定任务获得哪些资源
拓扑决定这些资源是否真正高效
```

## 自检问题

1. 节点内和节点间通信为什么不能等价看待？
2. GPUDirect RDMA 减少了哪类中转？
3. 为什么大模型扩容时间不等于容器启动时间？
4. GPU Device Plugin 为什么不等于拓扑感知调度？

## 参考资料

- [NVIDIA NCCL Documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/)
- [NCCL GPU Troubleshooting](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html)
- [Kubernetes Device Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
- [Kubernetes Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Slurm Generic Resource Scheduling](https://slurm.schedmd.com/gres.html)

---

**上一章：**[GPU 硬件、显存与节点拓扑](../09_GPU硬件显存与节点拓扑/README.md)

**下一章：**[可观测性、容量规划与成本](../11_可观测性容量规划与成本/README.md)
