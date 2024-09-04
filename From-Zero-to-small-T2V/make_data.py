# -*- coding:utf-8 -*-
# @Project:      From-Zero-to-AGI
# @Create Time : 2024/9/4 21:33
# @Author :      ai-mzq
# @File name:    make_data.py
# @Software:     PyCharm

import os
import cv2
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont


os.makedirs('training_dataset', exist_ok=True)
num_videos = 300 #30000
frames_per_video = 10
img_size = (64, 64)
shape_size = 10

# Define text prompts and corresponding movements for circles
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

# Define a function to create an image with a moving shape
def create_image_with_moving_shape(size, frame_num, shape, direction):
    img = Image.new('RGB', size, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    center_x, center_y = size[0] // 2, size[1] // 2
    if direction == "down":
        position = (center_x, (center_y + frame_num * 5) % size[1])
    elif direction == "left":
        position = ((center_x - frame_num * 5) % size[0], center_y)
    elif direction == "right":
        position = ((center_x + frame_num * 5) % size[0], center_y)
    elif direction == "diagonal_up_right":
        position = ((center_x + frame_num * 5) % size[0], (center_y - frame_num * 5) % size[1])
    elif direction == "diagonal_down_left":
        position = ((center_x - frame_num * 5) % size[0], (center_y + frame_num * 5) % size[1])
    elif direction == "diagonal_up_left":
        position = ((center_x - frame_num * 5) % size[0], (center_y - frame_num * 5) % size[1])
    elif direction == "diagonal_down_right":
        position = ((center_x + frame_num * 5) % size[0], (center_y + frame_num * 5) % size[1])
    elif direction == "rotate_clockwise":
        img = img.rotate(frame_num * 10, center=(center_x, center_y), fillcolor=(255, 255, 255))
        position = (center_x, center_y)
    elif direction == "rotate_counter_clockwise":
        img = img.rotate(-frame_num * 10, center=(center_x, center_y), fillcolor=(255, 255, 255))
        position = (center_x, center_y)
    elif direction == "bounce_vertical":
        position = (center_x, center_y - abs(frame_num * 5 % size[1] - center_y))
    elif direction == "bounce_horizontal":
        position = (center_x - abs(frame_num * 5 % size[0] - center_x), center_y)
    elif direction == "zigzag_vertical":
        position = (center_x, center_y - frame_num * 5 % size[1] if frame_num % 2 == 0 else center_y + frame_num * 5 % size[1])
    elif direction == "zigzag_horizontal":
        position = (center_x - frame_num * 5 % size[0] if frame_num % 2 == 0 else center_x + frame_num * 5 % size[0], center_y)
    elif direction == "up_left":
        position = ((center_x - frame_num * 5) % size[0], (center_y - frame_num * 5) % size[1])
    elif direction == "down_right":
        position = ((center_x + frame_num * 5) % size[0], (center_y + frame_num * 5) % size[1])
    elif direction == "down_left":
        position = ((center_x - frame_num * 5) % size[0], (center_y + frame_num * 5) % size[1])
    else:
        position = (center_x, center_y)

    if shape == "circle":
        draw.ellipse([position[0] - shape_size // 2, position[1] - shape_size // 2, position[0] + shape_size // 2, position[1] + shape_size // 2], fill=(0, 0, 255))

    return np.array(img)

# Generate the dataset
for video_num in range(num_videos):
    prompt, shape, direction = random.choice(prompts_and_movements)
    video_frames = []
    for frame_num in range(frames_per_video):
        img_array = create_image_with_moving_shape(img_size, frame_num, shape, direction)
        video_frames.append(img_array)

    # Save the frames as images in the training dataset directory
    video_dir = os.path.join('training_dataset', f'video_{video_num}')
    os.makedirs(video_dir, exist_ok=True)
    for frame_num, frame in enumerate(video_frames):
        frame_image = Image.fromarray(frame)
        frame_image.save(os.path.join(video_dir, f'frame_{frame_num}.png'))

print("Dataset generation complete.")


# Iterate over the number of videos to generate
for i in range(num_videos):
    # Randomly choose a prompt and movement from the predefined list
    prompt, shape, direction = random.choice(prompts_and_movements)

    # Create a directory for the current video
    video_dir = f'training_dataset/video_{i}'
    os.makedirs(video_dir, exist_ok=True)

    # Write the chosen prompt to a text file in the video directory
    with open(f'{video_dir}/prompt.txt', 'w') as f:
        f.write(prompt)

    # Generate frames for the current video
    for frame_num in range(frames_per_video):
        # Create an image with a moving shape based on the current frame number, shape, and direction
        img = create_image_with_moving_shape(img_size, frame_num, shape, direction)

        # Save the generated image as a PNG file in the video directory
        cv2.imwrite(f'{video_dir}/frame_{frame_num}.png', img)
