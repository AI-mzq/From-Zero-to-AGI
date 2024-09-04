# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-Transformer
# @Create Time : 2024/6/28 15:57
# @Author :      ai-mzq
# @File name:    first_transformer.py
# @Software:     PyCharm

import os
import yaml
import requests

import tiktoken
import torch

from model import TransformerLanguageModel

device = 'cuda' if torch.cuda.is_available() else 'cpu'  # Use GPU if it's available.
TORCH_SEED = 1337
torch.manual_seed(TORCH_SEED)


with open("hyp.yaml", errors='ignore') as f:
    hyp = yaml.safe_load(f)  # load hyps dict
    print("=======", hyp)

# Load training data
if not os.path.exists('data/sales_textbook.txt'):
    url = 'https://huggingface.co/datasets/goendalf666/sales-textbook_for_convincing_and_selling/raw/main/sales_textbook.txt'
    with open('data/sales_textbook.txt', 'w') as f:
        f.write(requests.get(url).text)
with open('data/sales_textbook.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Using TikToken (Same as GPT3) to tokenize the source text
encoding = tiktoken.get_encoding("cl100k_base")
tokenized_text = encoding.encode(text)
max_token_value = max(tokenized_text) + 1  # the maximum value of the tokenized numbers
tokenized_text = torch.tensor(tokenized_text, dtype=torch.long, device=device)  # put tokenized text into tensor

# Split train and validation
split_idx = int(len(tokenized_text) * 0.9)
train_data = tokenized_text[:split_idx]
val_data = tokenized_text[split_idx:]


# Get input embedding batch
def get_batch(hyp: dict, split: str):
    data = train_data if split == "train" else val_data
    idxs = torch.randint(low=0, high=len(data) - hyp["context_length"], size=(hyp["batch_size"],))
    x = torch.stack([data[idx:idx + hyp["context_length"]] for idx in idxs]).to(device)
    y = torch.stack([data[idx + 1:idx + hyp["context_length"] + 1] for idx in idxs]).to(device)
    return x, y


# Calulate loss
@torch.no_grad()
def estimate_loss(hyp: dict):
    out = {}
    model.eval()
    for split in ["train", "valid"]:
        losses = torch.zeros(hyp["eval_iters"])
        for k in range(hyp["eval_iters"]):
            x_batch, y_batch = get_batch(hyp, split)
            logits, loss = model(x_batch, y_batch)
            losses[k] = loss.item()
        out[split] = losses.mean()
    model.train()
    return out


# init model
model = TransformerLanguageModel(hyp, max_token_value).to(device)

# Use AdamW optimizer
optimizer = torch.optim.AdamW(params=model.parameters(), lr=float(hyp["learning_rate"]))
tracked_losses = list()
for step in range(hyp["max_iters"]):
    if step % hyp["eval_iters"] == 0 or step == hyp["max_iters"] - 1:
        losses = estimate_loss(hyp)
        tracked_losses.append(losses)
        print("step: ", step,
              "train loss: ", round(losses["train"].item(), 3),
              "val loss: ", round(losses["valid"].item(), 3))
    xb, yb = get_batch(hyp, "train")
    logits, loss = model(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

# Save the model state dictionary
torch.save(model.state_dict(), 'model-ckpt_v1.pt')

# Generate
model.eval()
start = 'The salesperson'
start_ids = encoding.encode(start)
x = (torch.tensor(start_ids, dtype=torch.long, device=device)[None, ...])
y = model.generate(x, max_new_tokens=100)
print("****************")
print(encoding.decode(y[0].tolist()))
print("****************")
