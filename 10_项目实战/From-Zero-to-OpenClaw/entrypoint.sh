#!/bin/bash
set -e

echo "=== Replacing environment variables in config ==="

# 使用 envsubst 替换环境变量
if [ -f /root/.openclaw/openclaw.json.template ]; then
    envsubst < /root/.openclaw/openclaw.json.template > /root/.openclaw/openclaw.json
    echo "Config file generated successfully"
    echo "Verifying config file..."
    cat /root/.openclaw/openclaw.json
else
    echo "ERROR: Template file not found!"
    exit 1
fi

echo "=== Starting OpenClaw ==="
exec "$@"