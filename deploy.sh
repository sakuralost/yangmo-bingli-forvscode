#!/bin/bash

# 部署脚本
echo "开始部署病例记录辅助软件..."

# 检查 Docker 是否安装
if ! [ -x "$(command -v docker)" ]; then
  echo "错误: Docker 未安装。" >&2
  exit 1
fi

# 检查 Docker Compose 是否安装
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "错误: Docker Compose 未安装。" >&2
  exit 1
fi

# 构建并启动容器
echo "构建并启动 Docker 容器..."
docker-compose down
docker-compose up -d --build

# 检查容器状态
echo "检查容器状态..."
docker-compose ps

echo "部署完成！应用现在应该可以通过 http://localhost 访问。"
echo "外部可以通过 http://218.29.70.36:14980 访问。"
