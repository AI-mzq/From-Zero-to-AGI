# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-AGI
# @Create Time : 2024/9/4 19:41
# @Author :      ai-mzq
# @File name:    dataloaders.py
# @Software:     PyCharm

import os
import torch

from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as transforms


class TextToVideoDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        # Initialize the dataset with root directory and optional transform
        self.root_dir = root_dir
        self.transform = transform
        # List all subdirectories in the root directory
        self.video_dirs = [os.path.join(root_dir, d) for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d))]
        # Initialize lists to store frame paths and corresponding prompts
        self.frame_paths = []
        self.prompts = []

        # Loop through each video directory
        for video_dir in self.video_dirs:
            # List all PNG files in the video directory and store their paths
            frames = [os.path.join(video_dir, f) for f in os.listdir(video_dir) if f.endswith('.png')]
            self.frame_paths.extend(frames)
            # Read the prompt text file in the video directory and store its content
            with open(os.path.join(video_dir, 'prompt.txt'), 'r') as f:
                prompt = f.read().strip()
            # Repeat the prompt for each frame in the video and store in prompts list
            self.prompts.extend([prompt] * len(frames))

    # Return the total number of samples in the dataset
    def __len__(self):
        return len(self.frame_paths)

    # Retrieve a sample from the dataset given an index
    def __getitem__(self, idx):
        # Get the path of the frame corresponding to the given index
        frame_path = self.frame_paths[idx]
        # Open the image using PIL (Python Imaging Library)
        image = Image.open(frame_path)
        # Get the prompt corresponding to the given index
        prompt = self.prompts[idx]

        # Apply transformation if specified
        if self.transform:
            image = self.transform(image)

        # Return the transformed image and the prompt
        return image, prompt


if __name__ == '__main__':
    # Define a set of transformations to be applied to the data
    transform = transforms.Compose([
        transforms.ToTensor(),  # Convert PIL Image or numpy.ndarray to tensor
        transforms.Normalize((0.5,), (0.5,))  # Normalize image with mean and standard deviation
    ])

    # Load the dataset using the defined transform
    dataset = TextToVideoDataset(root_dir='training_dataset', transform=transform)
    # Create a dataloader to iterate over the dataset
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=16, shuffle=True)
