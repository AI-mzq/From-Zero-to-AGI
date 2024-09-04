# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-AGI
# @Create Time : 2024/9/4 21:59
# @Author :      ai-mzq
# @File name:    gan_net.py
# @Software:     PyCharm

import torch
import torch.nn as nn


# Define a class for text embedding
class TextEmbedding(nn.Module):
    # Constructor method with vocab_size and embed_size parameters
    def __init__(self, vocab_size, embed_size):
        # Call the superclass constructor
        super(TextEmbedding, self).__init__()
        # Initialize embedding layer
        self.embedding = nn.Embedding(vocab_size, embed_size)

    # Define the forward pass method
    def forward(self, x):
        # Return embedded representation of input
        return self.embedding(x)


class Generator(nn.Module):
    def __init__(self, text_embed_size):
        super(Generator, self).__init__()

        # Fully connected layer that takes noise and text embedding as input
        self.fc1 = nn.Linear(100 + text_embed_size, 256 * 8 * 8)

        # Transposed convolutional layers to upsample the input
        self.deconv1 = nn.ConvTranspose2d(256, 128, 4, 2, 1)
        self.deconv2 = nn.ConvTranspose2d(128, 64, 4, 2, 1)
        self.deconv3 = nn.ConvTranspose2d(64, 3, 4, 2, 1)  # Output has 3 channels for RGB images

        # Activation functions
        self.relu = nn.ReLU(True)  # ReLU activation function
        self.tanh = nn.Tanh()       # Tanh activation function for final output

    def forward(self, noise, text_embed):
        # Concatenate noise and text embedding along the channel dimension
        x = torch.cat((noise, text_embed), dim=1)

        # Fully connected layer followed by reshaping to 4D tensor
        x = self.fc1(x).view(-1, 256, 8, 8)

        # Upsampling through transposed convolution layers with ReLU activation
        x = self.relu(self.deconv1(x))
        x = self.relu(self.deconv2(x))

        # Final layer with Tanh activation to ensure output values are between -1 and 1 (for images)
        x = self.tanh(self.deconv3(x))

        return x

class Discriminator(nn.Module):
    def __init__(self):
        super(Discriminator, self).__init__()

        # Convolutional layers to process input images
        self.conv1 = nn.Conv2d(3, 64, 4, 2, 1)   # 3 input channels (RGB), 64 output channels, kernel size 4x4, stride 2, padding 1
        self.conv2 = nn.Conv2d(64, 128, 4, 2, 1) # 64 input channels, 128 output channels, kernel size 4x4, stride 2, padding 1
        self.conv3 = nn.Conv2d(128, 256, 4, 2, 1) # 128 input channels, 256 output channels, kernel size 4x4, stride 2, padding 1

        # Fully connected layer for classification
        self.fc1 = nn.Linear(256 * 8 * 8, 1)  # Input size 256x8x8 (output size of last convolution), output size 1 (binary classification)

        # Activation functions
        self.leaky_relu = nn.LeakyReLU(0.2, inplace=True)  # Leaky ReLU activation with negative slope 0.2
        self.sigmoid = nn.Sigmoid()  # Sigmoid activation for final output (probability)

    def forward(self, input):
        # Pass input through convolutional layers with LeakyReLU activation
        x = self.leaky_relu(self.conv1(input))
        x = self.leaky_relu(self.conv2(x))
        x = self.leaky_relu(self.conv3(x))

        # Flatten the output of convolutional layers
        x = x.view(-1, 256 * 8 * 8)

        # Pass through fully connected layer with Sigmoid activation for binary classification
        x = self.sigmoid(self.fc1(x))

        return x