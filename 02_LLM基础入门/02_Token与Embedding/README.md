# 02_Token 与 Embedding

> LLM 不能直接处理自然语言文本。文本必须先被切成 Token，再被映射成向量，才能进入 Transformer 参与计算。

**原文解读链接🔗：**[Tokens 和 Embeddings](https://blog.csdn.net/m_aigc2022/article/details/140588456?spm=1001.2014.3001.5502)

**By：猫先生 of 「魔方AI空间」**

![alt text](../../imgs/魔方AI空间.png)

## 本章导读

如果说 Transformer 是 LLM 的“大脑”，那么 Tokenizer 和 Embedding 就是文本进入大脑前的“输入接口”。

我们在对话框里输入的是自然语言：

```text
大语言模型正在改变世界
```

但模型真正看到的不是汉字、单词或句子，而是一串数字 ID：

```text
[12035, 99513, 287, 48192, ...]
```

这些 ID 再经过 Embedding 层，变成高维向量，随后才会进入 Transformer。

本章重点回答：

- Token 是什么？
- Tokenizer 为什么重要？
- BPE、WordPiece、SentencePiece 有什么区别？
- Token ID 如何变成 Embedding 向量？
- 为什么中文 Tokenizer 会影响成本和效果？
- 输入 Embedding、位置编码、输出 Head 之间是什么关系？

## 从文本到模型输入

LLM 处理文本的大致流程如下：

```text
原始文本
  -> Tokenizer 切分
  -> Token ID 序列
  -> Token Embedding
  -> 加入位置信息
  -> Transformer Blocks
  -> 输出 logits
  -> 预测下一个 Token
```

举个简化例子：

```text
输入文本：从零走向 AGI

Tokenizer 输出：
["从", "零", "走向", " AG", "I"]

Token ID：
[5483, 31420, 78211, 4512, 40]

Embedding：
每个 Token ID 对应一个高维向量
```

真实模型中的切分结果会依赖具体 Tokenizer，不同模型可能切出完全不同的 Token 序列。

## Token 是什么？

Token 是模型处理文本的基本单位。它不一定等于一个字、一个词或一个英文单词。

Token 可能是：

- 一个汉字：`大`
- 一个英文单词：`model`
- 一个英文子词：`ing`
- 一个标点：`。`
- 一个空格加单词片段：` language`
- 一个特殊符号：`<bos>`、`<eos>`、`<pad>`

例如英文单词：

```text
unbelievable
```

可能被切成：

```text
["un", "believ", "able"]
```

中文句子：

```text
大语言模型
```

可能被切成：

```text
["大", "语言", "模型"]
```

也可能被切成：

```text
["大", "语", "言", "模型"]
```

具体结果由模型使用的 Tokenizer 决定。

## 为什么不直接按字或单词切分？

### 1. 按字切分

优点：

- 词表小
- 不容易遇到未登录词
- 对中文比较自然

缺点：

- 序列变长
- 上下文窗口被更快消耗
- 英文和代码场景效率较低

### 2. 按词切分

优点：

- 语义单位更完整
- 序列长度较短

缺点：

- 词表巨大
- 新词、拼写变化、代码符号处理困难
- 多语言场景不稳定

### 3. 子词切分

现代 LLM 大多采用子词切分。它在“词表大小”和“表达能力”之间做平衡。

例如：

```text
playing = play + ing
unhappy = un + happy
tokenization = token + ization
```

这样既能复用常见片段，又能处理新词和长尾词。

## 常见 Tokenizer 算法

### 1. BPE

BPE（Byte Pair Encoding）是 GPT 系列中常见的子词算法。

基本思想：

```text
从字符级别开始
  -> 统计最常见的相邻片段
  -> 反复合并高频片段
  -> 得到固定大小词表
```

特点：

- 简单高效
- 适合大规模语料
- 能处理罕见词和新词
- GPT、LLaMA 等模型广泛使用类似思想

### 2. WordPiece

WordPiece 常见于 BERT 系列。

特点：

- 同样属于子词切分
- 合并策略更偏概率建模
- 通常用 `##` 表示词内部片段

例如：

```text
playing -> play + ##ing
```

### 3. SentencePiece

SentencePiece 常见于 T5、LLaMA、Qwen 等模型。

特点：

- 把文本当作原始字符流处理
- 不依赖预先分词
- 对多语言更友好
- 常用特殊符号表示空格边界

它非常适合中文、日文、英文混合的多语言场景。

## 词表 Vocabulary

Tokenizer 会维护一个词表。词表中的每个 Token 都有一个唯一 ID。

示意：

| Token | Token ID |
| --- | ---: |
| `<bos>` | 1 |
| `<eos>` | 2 |
| `大` | 1024 |
| `语言` | 9231 |
| `模型` | 18233 |
| `Transformer` | 51288 |

词表大小会影响：

- 模型输入输出层规模
- Token 切分粒度
- 多语言支持能力
- 推理成本
- 罕见词处理能力

如果词表太小，文本会被切得很碎；如果词表太大，Embedding 矩阵和输出层会变得更重。

## 特殊 Token

除了普通文本 Token，LLM 还会使用特殊 Token 表示结构信息。

常见特殊 Token：

| 特殊 Token | 含义 |
| --- | --- |
| `<bos>` | 序列开始 |
| `<eos>` | 序列结束 |
| `<pad>` | 批处理补齐 |
| `<unk>` | 未知 Token |
| `<system>` | 系统指令 |
| `<user>` | 用户消息 |
| `<assistant>` | 助手回答 |

不同模型的特殊 Token 格式不一样。聊天模型尤其依赖这些结构化 Token 来区分系统、用户和助手角色。

## Token ID 如何变成 Embedding？

Tokenizer 的输出只是整数 ID，神经网络不能直接从 ID 中理解语义。Embedding 层的作用是把 Token ID 映射成向量。

可以把 Embedding 层理解成一个大表：

```text
Embedding Matrix: [vocab_size, hidden_size]
```

例如：

```text
词表大小 vocab_size = 100000
隐藏维度 hidden_size = 4096

Embedding 矩阵形状 = [100000, 4096]
```

当 Token ID 是 `18233` 时，模型会取出 Embedding 矩阵第 `18233` 行，得到一个 4096 维向量。

```text
Token ID 18233 -> Embedding[18233] -> 向量表示
```

这些向量会随着模型训练不断更新，逐渐编码语义、语法和上下文使用规律。

## Embedding 向量学到了什么？

Embedding 的直觉是：语义相近或使用场景相近的 Token，在向量空间中会更接近。

例如：

- `猫` 和 `狗` 可能更接近
- `北京` 和 `上海` 可能更接近
- `def`、`return`、`class` 在代码语料中可能形成一类结构
- `医生`、`医院`、`疾病` 可能在医学上下文中更相关

不过要注意：Token Embedding 只是静态输入表示。真正的上下文语义是在 Transformer 层中通过 Attention 动态计算出来的。

同一个 Token 在不同上下文中的含义，需要依赖后续 Transformer 表示。

例如：

```text
苹果很好吃。
苹果发布了新手机。
```

两个“苹果”的 Token ID 可能相同，但经过 Transformer 后的上下文表示会不同。

## 输入 Embedding 与位置编码

Token Embedding 只告诉模型“这是什么 Token”，但不告诉模型“它在第几个位置”。

对于句子：

```text
我喜欢你
你喜欢我
```

如果没有位置信息，这两个句子的 Token 集合很相似，但语义完全不同。

因此，模型还需要位置编码：

```text
输入表示 = Token Embedding + 位置信息
```

在现代 LLM 中，位置编码不一定是直接加到 Embedding 上，也可能通过 RoPE 等方式注入 Attention 计算中。

位置编码会在 [位置编码](../位置编码/README.md) 章节详细展开。

## 输出 Head 与下一个 Token 预测

Transformer 处理完输入后，会输出每个位置的隐藏状态。为了预测下一个 Token，模型需要把隐藏状态映射回词表空间。

这个输出层通常叫：

- LM Head
- Output Projection
- Language Modeling Head

它的输出形状通常是：

```text
[sequence_length, vocab_size]
```

每个位置都会得到一个词表大小的分数向量，这些分数叫 logits。

例如：

```text
当前位置隐藏状态
  -> LM Head
  -> 所有 Token 的 logits
  -> softmax 得到概率分布
  -> 采样或选择下一个 Token
```

## 权重共享

很多 LLM 会让输入 Embedding 矩阵和输出 LM Head 共享权重。

直觉上：

- 输入阶段：Token ID -> 向量
- 输出阶段：隐藏状态 -> Token 概率

这两个方向都围绕同一个词表空间进行，因此共享权重可以减少参数量，并增强输入输出表示的一致性。

不过是否共享权重取决于具体模型设计。

## 中文 Tokenizer 的特殊问题

中文和英文在 Tokenizer 上有明显差异。

英文天然有空格分隔，很多词边界比较清晰；中文没有显式空格，词边界更依赖语义。

例如：

```text
大模型部署
```

可能被切成：

```text
["大", "模型", "部署"]
```

也可能被切成：

```text
["大模型", "部署"]
```

如果一个模型的中文词表覆盖不好，中文会被切得更碎，带来几个问题：

- 同样内容需要更多 Token
- 上下文窗口消耗更快
- 推理成本更高
- 长文本处理更吃亏
- 中文语义片段可能不够稳定

所以评估一个模型时，不能只看上下文长度是多少，还要看对应语言下的 Tokenizer 效率。

## Token 数为什么影响成本？

大模型 API 和推理系统通常按 Token 计算成本，因为模型每处理一个 Token 都会产生计算开销。

Token 数影响：

- 输入成本
- 输出成本
- 上下文窗口占用
- 推理延迟
- KV Cache 显存占用
- 长文本任务稳定性

例如同样一段中文，如果模型 A 切成 1000 个 Token，模型 B 切成 1500 个 Token，那么在相同价格和上下文长度下，模型 B 的实际使用成本更高。

## 一个完整例子

以一句话为例：

```text
大语言模型正在改变软件开发。
```

模型处理流程可以理解为：

```text
1. Tokenizer 切分
   ["大", "语言", "模型", "正在", "改变", "软件", "开发", "。"]

2. 转成 Token ID
   [1024, 9231, 18233, 7712, 34221, 9012, 6511, 13]

3. 查 Embedding 表
   每个 Token ID -> 一个 hidden_size 维向量

4. 注入位置信息
   模型知道每个 Token 的顺序

5. 进入 Transformer
   通过 Attention 聚合上下文信息

6. 输出 logits
   预测下一个最可能的 Token
```

真实 Tokenizer 的切分结果可能不同，但整体流程一致。

## 常见误区

### 1. Token 不等于字或词

Token 是模型词表中的基本单位，可能是字、词、子词、符号或空格片段。

### 2. Tokenizer 不是无关紧要的预处理

Tokenizer 会直接影响成本、上下文长度、多语言效果和模型可用性。

### 3. Embedding 不是人工设计的语义表

Embedding 是训练出来的参数，不是人手工写入的词义字典。

### 4. 模型不是一次生成完整答案

LLM 通常是一个 Token 一个 Token 地生成，每一步都基于已有上下文重新计算或复用缓存。

### 5. 上下文长度不等于可处理字数

上下文长度以 Token 为单位，不同语言、不同 Tokenizer 下对应的字数差异很大。

## 核心概念表

| 概念 | 简单解释 | 关键影响 |
| --- | --- | --- |
| Token | 模型处理文本的基本单位 | 决定序列长度 |
| Tokenizer | 把文本切成 Token 的工具 | 影响成本和多语言效果 |
| Vocabulary | Token 到 ID 的映射表 | 决定词表空间 |
| Token ID | Token 对应的整数编号 | 用于查 Embedding |
| Embedding | Token 的向量表示 | 模型输入表示 |
| Position Encoding | 位置信息 | 让模型感知顺序 |
| LM Head | 输出层 | 预测下一个 Token |
| Logits | 每个候选 Token 的原始分数 | 生成采样依据 |

## 学习建议

学习这一章时，建议抓住三条主线：

1. **文本如何数字化**：文本 -> Token -> Token ID。
2. **数字如何向量化**：Token ID -> Embedding。
3. **向量如何生成文本**：Transformer hidden state -> logits -> 下一个 Token。

等你理解这三步，再学习 Transformer，就会更容易看懂输入输出的张量形状。

## 推荐实践

可以用 HuggingFace Transformers 简单观察不同模型的 Tokenizer 行为：

```python
from transformers import AutoTokenizer

text = "大语言模型正在改变软件开发。"

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")
tokens = tokenizer.tokenize(text)
ids = tokenizer.encode(text)

print(tokens)
print(ids)
print(len(ids))
```

可以尝试对比：

- 中文句子
- 英文句子
- 中英混合句子
- 代码片段
- 数学公式
- Markdown 文本

你会很直观地看到不同 Tokenizer 对同一段文本的切分差异。

## 推荐阅读

- [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909)
- [SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing](https://arxiv.org/abs/1808.06226)
- [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805)
- [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)

## 小结

Token 与 Embedding 是 LLM 的入口层。

```text
文本
  -> Tokenizer
  -> Token ID
  -> Embedding
  -> 位置信息
  -> Transformer
  -> logits
  -> 下一个 Token
```

理解这条链路，就能明白：LLM 表面上在处理语言，底层其实是在处理一串高维向量。

---

**上一章：**[什么是大语言模型](../01_什么是大语言模型/README.md)  
**下一章建议阅读：**[Transformer 架构核心](../README.md#3-transformer-架构核心)
