# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-Transformer
# @Create Time : 2024/6/28 22:23
# @Author :      ai-mzq
# @File name:    model.py
# @Software:     PyCharm

import math
import torch
import torch.nn as nn
from torch.nn import functional as F

device = 'cuda' if torch.cuda.is_available() else 'cpu'  # Use GPU if it's available.


class FeedForward(nn.Module):
    def __init__(self, hyp: dict):
        super().__init__()
        self.d_model = hyp["d_model"]
        self.dropout = hyp["dropout"]
        self.ffn = nn.Sequential(
            nn.Linear(in_features=self.d_model, out_features=self.d_model * 4),
            nn.ReLU(),
            nn.Linear(in_features=self.d_model * 4, out_features=self.d_model),
            nn.Dropout(hyp["dropout"])
        )

    def forward(self, x):
        return self.ffn(x)


# Define Scaled Dot Product Attention
class Attention(nn.Module):
    def __init__(self, hyp: dict, head_size: int):
        super().__init__()
        self.d_model = hyp["d_model"]
        self.head_size = head_size
        self.context_length = hyp["context_length"]
        self.dropout = hyp["dropout"]

        self.key_layer = nn.Linear(in_features=self.d_model, out_features=self.head_size, bias=False)
        self.query_layer = nn.Linear(in_features=self.d_model, out_features=self.head_size, bias=False)
        self.value_layer = nn.Linear(in_features=self.d_model, out_features=self.head_size, bias=False)

        self.register_buffer('tril', torch.tril(
            torch.ones((self.context_length, self.context_length))))  # Lower triangular mask
        self.dropout_layer = nn.Dropout(self.dropout)

    def forward(self, x):
        B, T, C = x.shape  # Batch size, Time steps(current context_length), Channels(dimensions)
        assert T <= self.context_length
        assert C == self.d_model
        q = self.query_layer(x)
        k = self.key_layer(x)
        v = self.value_layer(x)

        # Scaled dot product attention: Q @ K^T / sqrt(d_k)
        weights = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        # Apply masked attention
        weights = weights.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        weights = F.softmax(input=weights, dim=-1)
        weights = self.dropout_layer(weights)

        # Apply dot product attention: weights @ V
        out = weights @ v
        return out


# multi-head-Attention
class MultiHeadAttention(nn.Module):
    def __init__(self, hyp: dict, head_size: int):
        super().__init__()
        self.num_heads = hyp["num_heads"]
        self.head_size = head_size
        self.d_model = hyp["d_model"]
        self.context_length = hyp["context_length"]
        self.dropout = hyp["dropout"]

        self.heads = nn.ModuleList([Attention(hyp, head_size=self.head_size) for _ in range(self.num_heads)])
        self.projection_layer = nn.Linear(in_features=self.d_model, out_features=self.d_model)
        self.dropout_layer = nn.Dropout(hyp["dropout"])

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.projection_layer(out)
        out = self.dropout_layer(out)
        return out


class TransformerBloack(nn.Module):
    def __init__(self, hyp: dict, num_heads: int):
        super().__init__()
        self.d_model = hyp["d_model"]
        self.context_length = hyp["context_length"]
        self.head_size = hyp["d_model"] // num_heads  # head size should be divisible by d_model
        self.num_heads = num_heads
        self.dropout = hyp["dropout"]

        self.multi_head_attention_layer = MultiHeadAttention(hyp, head_size=self.head_size)
        self.feed_forward_layer = FeedForward(hyp)
        self.layer_norm_1 = nn.LayerNorm(normalized_shape=self.d_model)
        self.layer_norm_2 = nn.LayerNorm(normalized_shape=self.d_model)

    def forward(self, x):
        # Note: The order of the operations is different from the original Transformer paper
        # The order here is: LayerNorm -> Multi-head attention -> LayerNorm -> Feed forward
        x = x + self.multi_head_attention_layer(self.layer_norm_1(x))  # Residual connection
        x = x + self.feed_forward_layer(self.layer_norm_2(x))  # Residual connection
        return x


class TransformerLanguageModel(nn.Module):
    def __init__(self, hyp, max_token_value):
        super().__init__()
        self.d_model = hyp["d_model"]
        self.context_length = hyp["context_length"]
        self.num_heads = hyp["num_heads"]
        self.num_blocks = hyp["num_blocks"]
        self.dropout = hyp["dropout"]
        self.max_token_value = max_token_value
        # Set up token embedding look-up table
        self.token_embedding_lookup_table = nn.Embedding(
            num_embeddings=self.max_token_value + 1, embedding_dim=self.d_model
        )

        # Run all the transformer blocks
        # Different from original paper, here we add a final layer norm after all the blocks
        self.transformer_blocks = nn.Sequential(*(
            [TransformerBloack(hyp, num_heads=self.num_heads) for _ in range(self.num_blocks)] +
            [nn.LayerNorm(self.d_model)]
        ))
        self.language_model_out_linear_layer = nn.Linear(in_features=self.d_model, out_features=self.max_token_value)

    def forward(self, idx, targets=None):
        B, T = idx.shape
        """
        # Set up position embedding look-up table
        # following the same approach as the original Transformer paper (Sine and Cosine functions)
        """
        position_encoding_lookup_table = torch.zeros(self.context_length, self.d_model)
        position = torch.arange(0, self.context_length, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, self.d_model, 2).float() * (-math.log(10000.0) / self.d_model))
        position_encoding_lookup_table[:, 0::2] = torch.sin(position * div_term)
        position_encoding_lookup_table[:, 1::2] = torch.cos(position * div_term)
        # change position_encoding_lookup_table from (context_length, d_model) to (T, d_model)
        position_embedding = position_encoding_lookup_table[:T, :].to(device)
        x = self.token_embedding_lookup_table(idx) + position_embedding
        x = self.transformer_blocks(x)
        # The "logits" are the output values of our model before applying softmax
        logits = self.language_model_out_linear_layer(x)

        if targets is not None:
            B, T, C = logits.shape
            logits_reshaped = logits.view(B * T, C)
            targets_reshaped = targets.view(B * T)
            loss = F.cross_entropy(input=logits_reshaped, target=targets_reshaped)
        else:
            loss = None
        return logits, loss

    def generate(self, idx, max_new_tokens):
        # idx is (B,T) array of indices in the current context
        for _ in range(max_new_tokens):
            # Crop idx to the max size of our positional embeddings table
            idx_crop = idx[:, -self.context_length:]
            # Get predictions
            logits, loss = self(idx_crop)
            # Get the last time step from logits where the dimensions of the logits are (B,T,C)
            logits_last_timestep = logits[:, -1, :]
            # Apply softmax to get probabilities
            probs = F.softmax(input=logits_last_timestep, dim=-1)
            # Sample from the probabilities' distribution.
            idx_next = torch.multinomial(input=probs, num_samples=1)
            # Append the sampled indexes idx_next to idx
            idx = torch.cat((idx, idx_next), dim=1)
        return idx
