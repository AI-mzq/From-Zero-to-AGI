# Dockerfile for OpenClaw in Docker Container
# Based on ubuntu 24.04 with systemd support
FROM ubuntu:24.04

# Set environment variables
ENV TZ=Asia/Shanghai
ENV Container=docker
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Base packages + build deps + Chrome runtime deps
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    vim \
    xz-utils \
    locales \
    fonts-wqy-zenhei \
    language-pack-zh-hans \
    ca-certificates \
    gnupg \
    build-essential \
    python3 \
    make \
    g++ \
    pkg-config \
    git \
    fonts-liberation \
    libasound2t64 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libvulkan1 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Generate Chinese locales
RUN locale-gen zh_CN.UTF-8 && \
    locale-gen zh_CN.GBK && \
    update-locale LANG=zh_CN.UTF-8

# install Node.js v24.13.0
RUN wget -O node-v24.13.0-linux-x64.tar.xz https://nodejs.org/dist/v24.13.0/node-v24.13.0-linux-x64.tar.xz && \
    tar -xf node-v24.13.0-linux-x64.tar.xz && \
    cp -r node-v24.13.0-linux-x64/* /usr/local/ && \
    rm -rf node-v24.13.0-linux-x64

# Install Google Chrome
RUN wget -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get update && \
    apt-get install -y /tmp/google-chrome.deb && \
    rm -f /tmp/google-chrome.deb && \
    rm -rf /var/lib/apt/lists/*

# Install npm
# RUN curl -fsSL https://www.npmjs.com/install.sh | sh

# Install OpenClaw
# RUN curl -fsSL https://openclaw.bot/install.sh | bash
RUN npm install -g openclaw@latest --loglevel verbose

# Install Feishu plugin
RUN openclaw plugins install @openclaw/feishu || true

# Create OpenClaw configuration directory
RUN mkdir -p /root/.openclaw

# 复制配置文件模板
COPY openclaw.json /root/.openclaw/openclaw.json.template

# 安装 gettext 包以获取 envsubst 命令
RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

# 创建入口点脚本
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["openclaw", "gateway"]