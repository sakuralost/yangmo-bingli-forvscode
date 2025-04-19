# 部署指南

本文档提供了如何使用 Docker 部署病例记录辅助软件到私有服务器的详细说明。

## 前提条件

- 一台运行 Linux 的服务器（推荐 Ubuntu 20.04 或更高版本）
- 已安装 Docker 和 Docker Compose
- 基本的命令行操作知识

## 安装 Docker 和 Docker Compose

如果您的服务器尚未安装 Docker 和 Docker Compose，请按照以下步骤安装：

### 安装 Docker

\`\`\`bash
# 更新包索引
sudo apt update

# 安装必要的依赖
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# 添加 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 添加 Docker 仓库
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 更新包索引
sudo apt update

# 安装 Docker
sudo apt install -y docker-ce

# 启动 Docker 服务
sudo systemctl start docker

# 设置 Docker 开机自启
sudo systemctl enable docker

# 验证 Docker 安装
sudo docker --version
\`\`\`

### 安装 Docker Compose

\`\`\`bash
# 下载 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
\`\`\`

## 部署应用

### 1. 准备项目文件

将项目文件上传到服务器，可以使用 SCP、SFTP 或 Git 克隆等方式：

\`\`\`bash
# 使用 Git 克隆（如果您的项目在 Git 仓库中）
git clone https://github.com/your-username/medical-records.git
cd medical-records

# 或者，如果您直接上传了项目文件，确保进入项目目录
cd /path/to/medical-records
\`\`\`

### 2. 构建和启动 Docker 容器

\`\`\`bash
# 构建并启动容器（在后台运行）
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看应用日志
docker-compose logs -f
\`\`\`

### 3. 配置 Nginx（可选，用于域名访问）

如果您想通过域名访问应用，可以使用 Nginx 作为反向代理：

\`\`\`bash
# 安装 Nginx
sudo apt install -y nginx

# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/medical-records

# 复制项目中的 nginx.conf 内容到此文件，并修改 server_name 为您的域名

# 创建符号链接到 sites-enabled 目录
sudo ln -s /etc/nginx/sites-available/medical-records /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
\`\`\`

### 4. 配置 HTTPS（推荐）

为了保护患者数据，强烈建议配置 HTTPS：

\`\`\`bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 按照提示完成配置
\`\`\`

## 维护和更新

### 更新应用

当您有新版本的应用需要部署时：

\`\`\`bash
# 进入项目目录
cd /path/to/medical-records

# 拉取最新代码（如果使用 Git）
git pull

# 重新构建并启动容器
docker-compose down
docker-compose up -d --build
\`\`\`

### 备份数据

由于应用使用 localStorage 存储数据，数据实际上存储在用户的浏览器中。在生产环境中，建议实现一个后端 API 和数据库来持久化存储数据。

### 监控应用

\`\`\`bash
# 查看容器状态
docker-compose ps

# 查看容器资源使用情况
docker stats

# 查看应用日志
docker-compose logs -f
\`\`\`

## 故障排除

### 容器无法启动

\`\`\`bash
# 查看详细日志
docker-compose logs -f

# 检查 Docker 状态
sudo systemctl status docker

# 重启 Docker
sudo systemctl restart docker
\`\`\`

### 应用无法访问

\`\`\`bash
# 检查容器是否运行
docker-compose ps

# 检查端口是否正确映射
sudo netstat -tulpn | grep 3000

# 检查防火墙设置
sudo ufw status
\`\`\`

## 生产环境建议

1. **实现后端 API 和数据库**：替换 localStorage 存储，使用真实的后端 API 和数据库
2. **设置自动备份**：定期备份数据库
3. **配置监控**：使用 Prometheus 和 Grafana 等工具监控应用性能
4. **实现用户认证**：添加用户登录和权限控制
5. **配置 HTTPS**：保护数据传输安全
