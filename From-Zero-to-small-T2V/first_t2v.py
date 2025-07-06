# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-AGI
# @Create Time : 2024/9/4 22:22
# @Author :      ai-mzq
# @File name:    first_t2v.py
# @Software:     PyCharm

import os
import cv2
import torch
import torch.nn as nn
import numpy as np
import torch.optim as optim
import torchvision.transforms as transforms

from torch.utils.data import Dataset
from torchvision.utils import save_image
from dataloaders import TextToVideoDataset
from gan_net import Generator, Discriminator, TextEmbedding


prompts_and_movements = [
    ("circle moving down", "circle", "down"),  # Move circle downward
    ("circle moving left", "circle", "left"),  # Move circle leftward
    ("circle moving right", "circle", "right"),  # Move circle rightward
    ("circle moving diagonally up-right", "circle", "diagonal_up_right"),  # Move circle diagonally up-right
    ("circle moving diagonally down-left", "circle", "diagonal_down_left"),  # Move circle diagonally down-left
    ("circle moving diagonally up-left", "circle", "diagonal_up_left"),  # Move circle diagonally up-left
    ("circle moving diagonally down-right", "circle", "diagonal_down_right"),  # Move circle diagonally down-right
    ("circle rotating clockwise", "circle", "rotate_clockwise"),  # Rotate circle clockwise
    ("circle rotating counter-clockwise", "circle", "rotate_counter_clockwise"),  # Rotate circle counter-clockwise
    ("circle bouncing vertically", "circle", "bounce_vertical"),  # Bounce circle vertically
    ("circle bouncing horizontally", "circle", "bounce_horizontal"),  # Bounce circle horizontally
    ("circle zigzagging vertically", "circle", "zigzag_vertical"),  # Zigzag circle vertically
    ("circle zigzagging horizontally", "circle", "zigzag_horizontal"),  # Zigzag circle horizontally
    ("circle moving up-left", "circle", "up_left"),  # Move circle up-left
    ("circle moving down-right", "circle", "down_right"),  # Move circle down-right
    ("circle moving down-left", "circle", "down_left")  # Move circle down-left
]

# TODO 加载数据
transform = transforms.Compose([
    transforms.ToTensor(), # Convert PIL Image or numpy.ndarray to tensor
    transforms.Normalize((0.5,), (0.5,)) # Normalize image with mean and standard deviation
])

# Load the dataset using the defined transform
dataset = TextToVideoDataset(root_dir='training_dataset', transform=transform)
# Create a dataloader to iterate over the dataset
dataloader = torch.utils.data.DataLoader(dataset, batch_size=16, shuffle=True)

# Check for GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

all_prompts = [prompt for prompt, _, _ in prompts_and_movements]  # Extract all prompts from prompts_and_movements list
vocab = {word: idx for idx, word in enumerate(set(" ".join(all_prompts).split()))}  # Create a vocabulary dictionary where each unique word is assigned an index
vocab_size = len(vocab)  # Size of the vocabulary
embed_size = 10  # Size of the text embedding vector

def encode_text(prompt):
    # Encode a given prompt into a tensor of indices using the vocabulary
    return torch.tensor([vocab[word] for word in prompt.split()])

# Initialize models, loss function, and optimizers
text_embedding = TextEmbedding(vocab_size, embed_size).to(device)  # Initialize TextEmbedding model with vocab_size and embed_size
netG = Generator(embed_size).to(device)  # Initialize Generator model with embed_size
netD = Discriminator().to(device)  # Initialize Discriminator model
criterion = nn.BCELoss().to(device)  # Binary Cross Entropy loss function
optimizerD = optim.Adam(netD.parameters(), lr=0.0002, betas=(0.5, 0.999))  # Adam optimizer for Discriminator
optimizerG = optim.Adam(netG.parameters(), lr=0.0002, betas=(0.5, 0.999))  # Adam optimizer for Generator

# TODO 开始训练
num_epochs = 13  # # Number of epochs

for epoch in range(num_epochs):
    for i, (data, prompts) in enumerate(dataloader):
        real_data = data.to(device)

        prompts = [prompt for prompt in prompts]

        # Update Discriminator
        netD.zero_grad()  # Zero the gradients of the Discriminator
        batch_size = real_data.size(0)  # Get the batch size
        labels = torch.ones(batch_size, 1).to(device)  # Create labels for real data (ones)
        output = netD(real_data)  # Forward pass real data through Discriminator
        lossD_real = criterion(output, labels)  # Calculate loss on real data
        lossD_real.backward()  # Backward pass to calculate gradients

        # Generate fake data
        noise = torch.randn(batch_size, 100).to(device)  # Generate random noise
        text_embeds = torch.stack([text_embedding(encode_text(prompt).to(device)).mean(dim=0) for prompt in prompts])  # Encode prompts into text embeddings
        fake_data = netG(noise, text_embeds)  # Generate fake data from noise and text embeddings
        labels = torch.zeros(batch_size, 1).to(device)  # Create labels for fake data (zeros)
        output = netD(fake_data.detach())  # Forward pass fake data through Discriminator (detach to avoid gradients flowing back to Generator)
        lossD_fake = criterion(output, labels)  # Calculate loss on fake data
        lossD_fake.backward()  # Backward pass to calculate gradients
        optimizerD.step()  # Update Discriminator parameters

        # Update Generator
        netG.zero_grad()  # Zero the gradients of the Generator
        labels = torch.ones(batch_size, 1).to(device)  # Create labels for fake data (ones) to fool Discriminator
        output = netD(fake_data)  # Forward pass fake data (now updated) through Discriminator
        lossG = criterion(output, labels)  # Calculate loss for Generator based on Discriminator's response
        lossG.backward()  # Backward pass to calculate gradients
        optimizerG.step()  # Update Generator parameters

    # Print epoch information
    print(f"Epoch [{epoch + 1}/{num_epochs}] Loss D: {lossD_real + lossD_fake}, Loss G: {lossG}")

# TODO 保存模型
torch.save(netG.state_dict(), 'generator.pth')
torch.save(netD.state_dict(), 'discriminator.pth')

# TODO 推理
# Inference function to generate a video based on a given text prompt
def generate_video(text_prompt, num_frames=10):
    # Create a directory for the generated video frames based on the text prompt
    os.makedirs(f'generated_video_{text_prompt.replace(" ", "_")}', exist_ok=True)

    # Encode the text prompt into a text embedding tensor
    text_embed = text_embedding(encode_text(text_prompt).to(device)).mean(dim=0).unsqueeze(0)

    # Generate frames for the video
    for frame_num in range(num_frames):
        # Generate random noise
        noise = torch.randn(1, 100).to(device)

        # Generate a fake frame using the Generator network
        with torch.no_grad():
            fake_frame = netG(noise, text_embed)

        # Save the generated fake frame as an image file
        save_image(fake_frame, f'generated_video_{text_prompt.replace(" ", "_")}/frame_{frame_num}.png')

# usage of the generate_video function with a specific text prompt
generate_video('circle moving up-right')

# TODO 合成视频
folder_path = 'generated_video_circle_moving_up-right'

# Get the list of all PNG files in the folder
image_files = [f for f in os.listdir(folder_path) if f.endswith('.png')]

# Sort the images by name (assuming they are numbered sequentially)
image_files.sort()

# Create a list to store the frames
frames = []

# Read each image and append it to the frames list
for image_file in image_files:
    image_path = os.path.join(folder_path, image_file)
    frame = cv2.imread(image_path)
    frames.append(frame)

frames = np.array(frames)
fps = 10

# Create a video writer object
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('generated_video.avi', fourcc, fps, (frames[0].shape[1], frames[0].shape[0]))

# Write each frame to the video
for frame in frames:
    out.write(frame)

# Release the video writer
out.release()
