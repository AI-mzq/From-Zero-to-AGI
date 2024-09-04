# From-Zero-to-Transformer

#### 从头开始编写 Transformers ！！！
- v1.0.0

这是一个基于 Transformer 的大型语言模型 (LLM) 训练演示！

受 [nanoGPT](https://github.com/karpathy/nanoGPT) 的启发，并参考 [Transformer-from-scratch](https://github.com/waylandzhang/Transformer-from-scratch.git) 仓库，我编写了这个演示，以展示如何使用 PyTorch 从头开始​​训练 LLM。代码非常简单易懂。对于初学者来说，这是学习如何训练 LLM 的良好起点。

该demo是在450Kb的样本教科书数据集 [sample textbook](https://huggingface.co/datasets/goendalf666/sales-textbook_for_convincing_and_selling/raw/main/sales_textbook.txt) 上训练的，模型大小约为51M。


## 开始使用

1. 安装依赖

```bash
pip install numpy requests torch tiktoken
```

2. 下载数据集

```bash
wget https://huggingface.co/datasets/goendalf666/sales-textbook_for_convincing_and_selling/raw/main/sales_textbook.txt -O data/sales_textbook.txt
```

3. 运行训练

```bash
python first_transformer.py
```

``` 
Step: 0 Training Loss: 11.68 Validation Loss: 11.681
Step: 20 Training Loss: 10.322 Validation Loss: 10.287
Step: 40 Training Loss: 8.689 Validation Loss: 8.783
Step: 60 Training Loss: 7.198 Validation Loss: 7.617
Step: 80 Training Loss: 6.795 Validation Loss: 7.353
Step: 100 Training Loss: 6.598 Validation Loss: 6.789
``` 

随着训练的进行，训练损失将会减少。 5000 次迭代后，训练将停止，损失降至 2.807 左右。该模型将以名称 model-ckpt.pt 保存。

然后，将生成一个示例文本，并将其从我们刚刚训练的模型弹出到控制台屏幕，如下所示：
```text
The salesperson to identify the other cost savings interaction towards a nextProps audience, and interactive relationships with them. Creating a genuine curiosityouraging a persuasive knowledge, focus on the customer's strengths and responding, as a friendly and thoroughly authority. 
Encouraging open communication style to customers that their values in the customer's individual finding the conversation.2. Addressing a harmoning ConcernBIG: Giving and demeanor is another vital aspect of practicing a successful sales interaction. By sharing case studies, addressing any this compromising clearly, pis
```


### References
- [nanoGPT](https://github.com/karpathy/nanoGPT) 
- [Transformers from Scratch](https://blog.matdmiller.com/posts/2023-06-10_transformers/notebook.html)
- [Attention is all you need](https://arxiv.org/abs/1706.03762) 
- [Transformer-from-scratch](https://github.com/waylandzhang/Transformer-from-scratch.git) 