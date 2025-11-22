### 🚀 一文梳理 RLHF 进化史：从 PPO → DPO → GRPO → GSPO

**原文解读链接🔗：**[一文梳理 RLHF 进化史：从PPO、DPO、GRPO到GSPO](http://mp.weixin.qq.com/s/7QrKR2WqjnGAXdV7lwSPUA?token=496007473&lang=zh_CN)

By：猫先生

<div align="center">

![RLHF Evolution](https://img.shields.io/badge/RLHF-算法演进-blue?style=for-the-badge)
![LLM Alignment](https://img.shields.io/badge/大模型-对齐技术-green?style=for-the-badge)
![2017-2024](https://img.shields.io/badge/时间跨度-2017~2024-orange?style=for-the-badge)

</div>


## 📖 简介

> 🎯 **核心价值**: 本文以经典的PPO算法为起点，系统梳理RLHF核心对齐算法的演进脉络，深入剖析各算法间的技术传承与创新突破。

随着大语言模型（LLM）的飞速发展，**如何使模型输出与人类价值观和偏好对齐**，已成为AI领域的核心挑战。基于人类反馈的强化学习（RLHF）是解决这一问题的关键技术范式。

<div align="center">

### 🔄 技术演进图谱

![](imgs/image.png)


*从稳定性基础到效率优化，再到架构适配的完整技术链*

</div>

## 🏆 算法创新亮点

| 算法 | 🎯 核心突破 | ⚡ 技术特色 | 📈 解决的问题 |
|------|-------------|------------|---------------|
| **🟥 PPO** | RLHF技术奠基 | 裁剪机制 + GAE优势函数 | 策略更新稳定性 |
| **🟦 DPO** | 奖励模型绕过 | 直接偏好优化 | 训练流程简化 |
| **🟩 GRPO** | 组内比较机制 | 相对策略优化 | Critic网络替代 |
| **🟪 Dr.GRPO** | 偏差修正 | 长度/难度公平性 | 优化偏差消除 |
| **🟨 DAPO** | 解耦策略 | 动态采样优化 | 训练稳定性增强 |
| **🟧 GSPO** | 序列级优化 | MoE架构适配 | 大模型专项优化 |

## 📚 详细目录导航

<div align="center">

### 🎪 RLHF 核心对齐算法
</div>

- 🟥 **[PPO](PPO/readme.md)**：近端策略优化算法 · *`RLHF技术基石`*
- 🟦 **[DPO](DPO/readme.md)**：直接偏好优化算法 · *`简化训练流程`*  
- 🟩 **[GRPO](GRPO/readme.md)**：组相对策略优化 · *`组内比较创新`*
- 🟪 **[Dr.GRPO](Dr.GRPO/readme.md)**：优化偏差的修正 · *`公平性突破`*
- 🟨 **[DAPO](DAPO/readme.md)**：解耦裁剪与动态采样 · *`稳定性增强`*
- 🟧 **[GSPO](GSPO/readme.md)**：序列级优化 · *`MoE架构适配`*

## 💡 技术演进洞察

> 🔬 **演进规律总结**: 
> - **PPO** → 奠定RLHF基础框架
> - **DPO** → 简化奖励建模流程  
> - **GRPO** → 引入组内比较机制
> - **Dr.GRPO/DAPO** → 优化偏差与稳定性
> - **GSPO** → 面向现代大模型架构

<div align="center">

⭐ ────────────────────────────────────────────────────────────── ⭐

**🎯 每篇文档包含**: 算法原理 · 代码实现 · 实验对比 · 实践指南等  
**🚀 适合读者**: 研究者 · 工程师 · 学生 · 技术爱好者

📖 **立即点击上方链接，开始您的RLHF技术探索之旅！**

⭐ ────────────────────────────────────────────────────────────── ⭐

<div align="right">

*最后更新: 2025年11月 | 持续更新中...*

</div>