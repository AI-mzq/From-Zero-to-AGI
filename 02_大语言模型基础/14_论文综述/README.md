# 14_论文综述

> 论文综述不是把论文标题背下来，而是建立一张“从基础架构到训练、对齐、推理、评测、应用系统”的阅读地图，知道每篇论文回答了什么问题、解决了哪一段技术链路。

**By：猫先生 of 「魔方AI空间」**

## 本章导读

学完前面的 LLM 基础模块后，你已经具备阅读论文的基本前置知识：

```text
Token / Embedding
  -> Transformer / Attention / 位置编码
  -> 架构演进 / MoE
  -> 预训练 / 指令微调 / RLHF
  -> 推理生成 / Prompt / 评测
```

接下来更重要的问题是：

```text
面对越来越多的大模型论文，应该按什么顺序读？
```

如果直接从最新技术报告开始，很容易陷入术语堆叠。更好的方法是先建立主线：

- 先读综述，形成全局地图。
- 再读经典基础论文，理解关键概念来源。
- 再读技术报告，理解现代模型如何组合这些技术。
- 最后按方向深入：训练、对齐、推理、评测、RAG、Agent、系统部署。

本章重点回答：

- LLM 入门应该优先读哪些综述？
- Transformer、GPT、LLaMA、MoE、Scaling Law 等经典论文如何串起来？
- 预训练、指令微调、RLHF、DPO、GRPO 等论文应该按什么顺序读？
- Prompt、推理、RAG、Agent、评测方向有哪些代表论文？
- 如何从一篇论文中快速提取对自己有用的信息？

## 一句话理解论文阅读

LLM 论文阅读可以理解为：

> 用少量综述建立地图，用经典论文建立骨架，用技术报告补全现代工程细节，再用方向论文深入某个能力模块。

不要把论文当成孤立文章读，而要把它放进技术链路里：

```text
它解决了哪一个问题？
它改了模型、数据、训练目标、推理策略，还是评测方式？
它为什么在当时重要？
它对今天的大模型还有没有影响？
```

## 推荐阅读路线

```mermaid
flowchart LR
    SURVEY["综述论文<br/>建立全局地图"] --> BASE["基础论文<br/>Transformer / GPT / Scaling Law"]
    BASE --> ARCH["架构演进<br/>LLaMA / MoE / DeepSeek / Qwen"]
    ARCH --> TRAIN["训练与后训练<br/>Pretrain / SFT / RLHF / DPO"]
    TRAIN --> INFER["推理与 Prompt<br/>CoT / ReAct / Decoding"]
    INFER --> EVAL["评测与安全<br/>MMLU / HELM / Arena / Hallucination"]
    EVAL --> APP["应用系统<br/>RAG / Agent / Tool Use"]
    APP --> SYSTEM["系统部署<br/>FlashAttention / vLLM / Quantization"]

    classDef survey fill:#E8F3FF,stroke:#2F80ED,color:#113B68,stroke-width:1.5px;
    classDef core fill:#F4ECFF,stroke:#8E44AD,color:#3D1F5A,stroke-width:1.5px;
    classDef train fill:#EEF8F2,stroke:#27AE60,color:#174A2A,stroke-width:1.5px;
    classDef eval fill:#FFF7E6,stroke:#F2994A,color:#6B3D09,stroke-width:1.5px;
    classDef system fill:#FFECEC,stroke:#EB5757,color:#6B1F1F,stroke-width:1.5px;
    class SURVEY survey;
    class BASE,ARCH core;
    class TRAIN,INFER train;
    class EVAL,APP eval;
    class SYSTEM system;
```

建议不要追求“一次性读完所有论文”。更有效的方式是：

```text
先读 5 篇建立主线
  -> 再读 10 篇补齐关键模块
  -> 最后按自己的方向深入 20 篇
```

## 第一层：LLM 总览综述

这类论文适合用来建立大模型全局地图。

| 论文 | 类型 | 适合解决的问题 |
| --- | --- | --- |
| [A Survey of Large Language Models](https://arxiv.org/abs/2303.18223) | 综述 | 系统理解 LLM 的模型、训练、使用、评测与挑战 |
| [Large Language Models: A Survey](https://arxiv.org/abs/2402.06196) | 综述 | 从能力、训练、应用和风险角度理解 LLM |
| [Large language models: survey, technical frameworks, and future challenges](https://link.springer.com/article/10.1007/s10462-024-10888-y) | 综述 | 了解 LLM 技术框架和未来挑战 |
| [Harnessing the Power of LLMs in Practice: A Survey on ChatGPT and Beyond](https://arxiv.org/abs/2304.13712) | 综述 | 从应用实践角度理解 ChatGPT 之后的 LLM 生态 |

### 阅读重点

读综述时，不建议逐字啃完。更重要的是抓住：

- 论文如何给 LLM 技术分层。
- 每个方向有哪些代表方法。
- 哪些问题已经形成共识。
- 哪些问题仍然开放。
- 综述引用了哪些高频经典论文。

可以把综述当作“论文导航页”，而不是最终答案。

## 第二层：基础架构经典论文

LLM 的技术骨架来自 Transformer、自回归语言模型和规模化训练。

| 论文 | 类型 | 为什么重要 |
| --- | --- | --- |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 架构 | 提出 Transformer，现代 LLM 的基础架构 |
| [Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) | 方法 | GPT 路线的早期代表：生成式预训练 + 下游微调 |
| [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) | 技术报告 | GPT-2 展示大规模语言模型的零样本能力 |
| [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 技术报告 | GPT-3 系统展示 Few-shot / In-context Learning |
| [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) | 理论/经验规律 | 建立模型规模、数据、计算量与损失之间的经验关系 |
| [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) | Scaling Law | Chinchilla 说明数据规模与模型规模需要重新平衡 |

### 这组论文串起来是什么？

```text
Transformer 提供通用架构
  -> GPT 证明 Decoder-only 自回归路线可行
  -> GPT-2 / GPT-3 展示规模化带来的通用能力
  -> Scaling Law 解释“规模、数据、计算”如何影响能力
  -> Chinchilla 重新校准数据量与参数量的配比
```

这条线是理解现代 LLM 的第一根主线。

## 第三层：现代 LLM 技术报告

技术报告通常不像方法论文那样只讲一个创新点，而是讲一个完整模型系统如何训练出来。

| 论文 / 报告 | 类型 | 阅读重点 |
| --- | --- | --- |
| [PaLM: Scaling Language Modeling with Pathways](https://arxiv.org/abs/2204.02311) | 技术报告 | 大规模 Dense 模型训练和能力评测 |
| [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971) | 技术报告 | 开源基础模型、数据质量和高效训练 |
| [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288) | 技术报告 | Base Model、Chat Model 与安全对齐 |
| [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783) | 技术报告 | 新一代开源模型的训练、后训练和评测体系 |
| [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774) | 技术报告 | 大规模多模态模型能力、评测和安全分析 |
| [Qwen Technical Report](https://arxiv.org/abs/2309.16609) | 技术报告 | 中文和多语言开源模型体系 |
| [Qwen2 Technical Report](https://arxiv.org/abs/2407.10671) | 技术报告 | 多语言、代码、数学和长上下文能力演进 |
| [DeepSeek-V2](https://arxiv.org/abs/2405.04434) | 技术报告 | MLA、MoE 与高性价比训练推理 |
| [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) | 技术报告 | 大规模 MoE 训练、工程优化和模型能力 |
| [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | 技术报告 | 强化学习激发推理能力的代表性路线 |

### 技术报告怎么读？

技术报告通常很长，建议按这个顺序读：

1. **模型架构**：Dense 还是 MoE？Attention 用 MHA、GQA、MLA 还是其他变体？
2. **训练数据**：数据规模、语言分布、去重、过滤、合成数据策略。
3. **训练流程**：预训练、继续训练、SFT、偏好优化、RL。
4. **评测结果**：通用、数学、代码、中文、长上下文、安全。
5. **工程细节**：并行策略、吞吐、稳定性、推理成本。

## 第四层：MoE 与高效架构

MoE 是现代大模型扩容的重要路线，尤其适合理解 DeepSeek、Mixtral、Qwen-MoE 等模型。

| 论文 | 类型 | 为什么重要 |
| --- | --- | --- |
| [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538) | 方法 | 早期稀疏门控 MoE 代表论文 |
| [GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding](https://arxiv.org/abs/2006.16668) | 系统/架构 | 条件计算与自动分片的大规模 MoE 实践 |
| [Switch Transformers](https://arxiv.org/abs/2101.03961) | 方法 | Top-1 路由，简化 MoE 训练 |
| [ST-MoE](https://arxiv.org/abs/2202.08906) | 方法 | 稳定和可迁移的稀疏专家模型设计 |
| [Mixtral of Experts](https://arxiv.org/abs/2401.04088) | 技术报告 | 开源 Sparse MoE 代表模型 |
| [DeepSeekMoE](https://arxiv.org/abs/2401.06066) | 方法 | 细粒度专家和共享专家机制 |

这组论文建议配合本项目的 [MoE 模型](../07_MoE模型/README.md) 章节阅读。

## 第五层：预训练与数据

预训练论文要重点关注训练目标、数据质量、规模化规律和训练稳定性。

| 论文 | 类型 | 阅读重点 |
| --- | --- | --- |
| [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) | 经验规律 | 损失与模型规模、数据、计算量的关系 |
| [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) | 经验规律 | Chinchilla 数据-参数配比 |
| [The RefinedWeb Dataset for Falcon LLM](https://arxiv.org/abs/2306.01116) | 数据 | Web 数据清洗、过滤和去重 |
| [Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research](https://arxiv.org/abs/2402.00159) | 数据 | 开放预训练语料构建流程 |
| [RedPajama: An Open Source Recipe to Reproduce LLaMA training dataset](https://arxiv.org/abs/2307.05222) | 数据 | 复现 LLaMA 风格数据配方 |

### 阅读重点

- 数据质量往往比单纯数据量更关键。
- 去重会影响评测污染和泛化能力。
- 多语言、代码、数学数据比例会改变模型能力结构。
- 合成数据在后训练和推理能力提升中越来越重要。
- 训练稳定性是大模型工程中最贵的问题之一。

## 第六层：指令微调与对齐

后训练让模型从“会续写文本”变成“会作为助手完成任务”。

| 论文 | 类型 | 为什么重要 |
| --- | --- | --- |
| [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) | RLHF | InstructGPT，现代对齐训练的经典起点 |
| [Self-Instruct](https://arxiv.org/abs/2212.10560) | 指令数据 | 用模型自动构造指令数据 |
| [Constitutional AI](https://arxiv.org/abs/2212.08073) | RLAIF | 用原则和 AI 反馈降低人工偏好依赖 |
| [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 偏好优化 | 用更简单的目标替代复杂 RLHF 流程 |
| [RLHF / RLAIF / DPO 系列后续论文](../10_RLHF/README.md) | 方向延展 | 建议结合本项目 RLHF 章节系统阅读 |
| [DeepSeekMath](https://arxiv.org/abs/2402.03300) | 推理/强化学习 | 展示数学能力训练和 GRPO 思路 |
| [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | 推理对齐 | 强化学习激发长链推理能力 |

这一组论文建议按以下顺序读：

```text
InstructGPT
  -> Self-Instruct
  -> Constitutional AI
  -> DPO
  -> DeepSeekMath / GRPO
  -> DeepSeek-R1
```

## 第七层：Prompt、推理与工具调用

Prompt 方向论文回答的是：不改模型参数时，如何通过输入组织提升模型能力。

| 论文 | 类型 | 解决的问题 |
| --- | --- | --- |
| [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) | Prompt | 用中间推理步骤提升复杂问题表现 |
| [Self-Consistency Improves Chain of Thought Reasoning](https://arxiv.org/abs/2203.11171) | 推理策略 | 多条推理路径投票提升稳定性 |
| [Least-to-Most Prompting](https://arxiv.org/abs/2205.10625) | Prompt | 把复杂问题拆成逐步子问题 |
| [ReAct](https://arxiv.org/abs/2210.03629) | Agent / Prompt | 结合推理和行动，连接工具调用 |
| [Toolformer](https://arxiv.org/abs/2302.04761) | 工具调用 | 让模型学习何时调用外部工具 |

这一组论文和 [Prompt 工程](../12_Prompt工程/README.md) 章节直接对应。

## 第八层：评测、幻觉与安全

评测论文决定我们如何比较模型，也会反过来影响模型优化方向。

| 论文 | 类型 | 阅读重点 |
| --- | --- | --- |
| [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300) | Benchmark | MMLU，多学科知识能力 |
| [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) | 评测框架 | HELM，多维度综合评测 |
| [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) | 评测方法 | 用强模型评价开放式对话 |
| [Chatbot Arena](https://arxiv.org/abs/2403.04132) | 人类偏好评测 | 基于真实用户偏好的模型对战 |
| [TruthfulQA](https://arxiv.org/abs/2109.07958) | 幻觉/真实性 | 模型是否会模仿人类错误说法 |
| [A Survey on Hallucination in Large Language Models](https://arxiv.org/abs/2311.05232) | 综述 | 幻觉类型、成因和缓解方法 |
| [Prompt Injection attack against LLM-integrated Applications](https://arxiv.org/abs/2306.05499) | 安全 | LLM 应用中的 Prompt 注入风险 |

评测论文建议不要只看排行榜分数，而要看：

- 数据集怎么构造。
- 任务是否覆盖真实场景。
- 评分方式是否可靠。
- 是否存在数据污染。
- 对不同语言、不同任务是否公平。

## 第九层：RAG 与 Agent

RAG 和 Agent 是 LLM 应用落地的两条重要路线。

| 论文 | 类型 | 为什么重要 |
| --- | --- | --- |
| [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | RAG | 经典 RAG 起点，把检索与生成结合 |
| [REALM](https://arxiv.org/abs/2002.08909) | 检索增强 | 预训练中引入可学习检索 |
| [Atlas](https://arxiv.org/abs/2208.03299) | 检索增强 | Few-shot 场景下的检索增强语言模型 |
| [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) | 综述 | 系统梳理 RAG 技术栈 |
| [RAGAS](https://arxiv.org/abs/2309.15217) | 评测 | RAG 系统自动化评测方法 |
| [ReAct](https://arxiv.org/abs/2210.03629) | Agent | 推理和行动交替，是 Agent Prompt 的经典框架 |
| [A Survey on Large Language Model based Autonomous Agents](https://link.springer.com/article/10.1007/s11704-024-40231-1) | 综述 | Agent 架构、记忆、规划、工具和评测 |

这部分建议与本项目的 [Agent/RAG/MCP 板块](../../07_Agent-RAG-MCP/README.md) 联动阅读。

## 第十层：推理系统与部署

系统论文关注的是：模型已经训练好后，如何更快、更省、更稳定地服务用户。

| 论文 | 类型 | 解决的问题 |
| --- | --- | --- |
| [FlashAttention](https://arxiv.org/abs/2205.14135) | 系统/算法 | 用 IO-aware 方法提升 Attention 计算效率 |
| [FlashAttention-2](https://arxiv.org/abs/2307.08691) | 系统/算法 | 进一步提升并行效率和吞吐 |
| [vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention](https://arxiv.org/abs/2309.06180) | 推理系统 | PagedAttention 与高吞吐 LLM Serving |
| [SmoothQuant](https://arxiv.org/abs/2211.10438) | 量化 | 大模型 W8A8 量化 |
| [GPTQ](https://arxiv.org/abs/2210.17323) | 量化 | 训练后量化代表方法 |
| [QLoRA](https://arxiv.org/abs/2305.14314) | 微调/量化 | 低成本微调大模型 |

系统方向阅读建议关注：

- Attention 计算瓶颈
- KV Cache 显存占用
- Prefill / Decode 阶段差异
- 批处理和调度
- 量化对效果与速度的影响
- 多 GPU / 多节点部署复杂度

## 10 篇必读论文清单

如果只选 10 篇作为 LLM 入门主线，建议从这些开始：

| 顺序 | 论文 | 为什么先读 |
| ---: | --- | --- |
| 1 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 理解 Transformer 起点 |
| 2 | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 理解 GPT-3 和 In-context Learning |
| 3 | [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) | 理解规模化规律 |
| 4 | [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) | 理解数据与计算最优配比 |
| 5 | [LLaMA](https://arxiv.org/abs/2302.13971) | 理解开源基础模型路线 |
| 6 | [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) | 理解 RLHF 和助手模型 |
| 7 | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 理解偏好优化简化路线 |
| 8 | [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903) | 理解推理 Prompt |
| 9 | [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) | 理解评测体系 |
| 10 | [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | 理解 RAG 起点 |

这 10 篇读完之后，再根据兴趣进入 MoE、Agent、系统部署或安全方向。

## 论文阅读模板

读每篇论文时，可以用下面这个模板做笔记：

```text
论文标题：
年份 / 作者 / 机构：
研究问题：
核心方法：
关键创新：
实验设置：
主要结论：
局限性：
和已有方法的关系：
对当前 LLM 的影响：
我可以复用到哪里：
```

更进一步，可以把每篇论文归入下面的技术层：

| 层级 | 关注点 |
| --- | --- |
| 架构层 | 模型结构、Attention、MoE、位置编码 |
| 数据层 | 预训练语料、指令数据、偏好数据、合成数据 |
| 训练层 | 目标函数、优化、并行、稳定性 |
| 对齐层 | SFT、RLHF、DPO、RLAIF、GRPO |
| 推理层 | 解码策略、CoT、搜索、工具调用 |
| 评测层 | Benchmark、人工偏好、LLM Judge、安全评测 |
| 系统层 | Serving、KV Cache、量化、调度、成本 |

## 如何判断一篇论文值不值得读？

可以从几个角度判断：

### 1. 它是否提出了可复用概念？

例如 Transformer、CoT、RAG、DPO、MoE、PagedAttention，这些概念会被大量后续论文继承。

### 2. 它是否改变了工程实践？

例如 FlashAttention、vLLM、QLoRA 这类论文，直接影响训练和推理系统。

### 3. 它是否是主流模型报告？

例如 LLaMA、Qwen、DeepSeek、GPT-4 技术报告，能帮助我们理解工业级模型如何组合技术。

### 4. 它是否定义了重要评测？

例如 MMLU、HELM、HumanEval、SWE-bench、Chatbot Arena，会反过来影响模型优化方向。

### 5. 它是否是高质量综述？

综述不一定提出新方法，但能帮助你快速建立地图，减少盲目搜索。

## 常见误区

### 1. 只追最新论文，不读经典论文

很多新论文是在经典概念上叠加工程细节。不懂经典论文，很容易看不出真正贡献。

### 2. 只读结论，不看实验设置

论文结论依赖数据、模型规模、评测方式和推理预算。脱离实验设置看结论，很容易误读。

### 3. 只看排行榜，不看方法

高分模型不一定方法有启发。读论文要区分“结果强”和“思想强”。

### 4. 只读方法论文，不读技术报告

现代 LLM 能力往往来自数据、训练、后训练、工程和评测共同作用，技术报告能展示完整系统。

### 5. 读完不做笔记

论文不做结构化笔记，很快就会变成“好像读过”。建议每篇至少写下研究问题、核心方法和局限性。

## 学习建议

建议按三轮推进：

### 第一轮：建立主线

目标是知道 LLM 主要模块有哪些。

```text
综述
  -> Transformer
  -> GPT-3
  -> Scaling Law
  -> LLaMA
  -> InstructGPT
  -> CoT
  -> HELM
```

### 第二轮：按模块深入

选择 2 到 3 个方向深入，例如：

- 架构：MoE、GQA、MLA、位置编码。
- 训练：数据、Scaling Law、继续预训练。
- 对齐：RLHF、DPO、GRPO、RLAIF。
- 应用：RAG、Agent、Tool Use。
- 系统：FlashAttention、vLLM、量化。

### 第三轮：结合实践复现

读论文最终要落到实践：

- 复现一个小型 Transformer。
- 跑一个公开评测集。
- 做一个最小 RAG Demo。
- 对比不同 Prompt 策略。
- 复现一个 LoRA / QLoRA 微调流程。

只有把论文和代码、实验、业务问题连起来，论文才会变成真正的能力。

## 小结

LLM 论文阅读的核心可以概括为：

```text
综述建立地图
  -> 经典论文建立骨架
  -> 技术报告理解工业实践
  -> 方向论文深入模块
  -> 笔记和实验沉淀能力
```

不要追求把所有论文都读完。更好的方式是围绕一条主线持续迭代：每读一篇论文，都要知道它在 LLM 技术链路中的位置。

---

**上一章：**[LLM 评测](../13_LLM评测/README.md)  
**下一章建议阅读：**[LLM 应用前置知识](../README.md#15-llm-应用前置知识)
