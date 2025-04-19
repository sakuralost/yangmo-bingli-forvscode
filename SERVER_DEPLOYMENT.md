# 服务器部署指南

本文档提供了如何将病例记录辅助软件部署到特定服务器的详细说明。

## 服务器信息

- 服务器 IP: 218.29.70.36
- SSH 端口: 14922
- 前端服务端口映射: 外部 14980 -> 内部 80
- 后端服务端口映射: 外部 14988 -> 内部 8080

## 部署步骤

### 1. 连接到服务器

使用 SSH 连接到服务器：

\`\`\`bash
ssh -p 14922 your-username@218.29.70.36
\`\`\`

### 2. 创建项目目录

\`\`\`bash
mkdir -p ~/medical-records
cd ~/medical-records
\`\`\`

### 3. 上传项目文件

在本地终端执行以下命令，将项目文件上传到服务器：

\`\`\`bash
# 从本地上传项目文件到服务器
scp -P 14922 -r ./* your-username@218.29.70.36:~/medical-records/
\`\`\`

或者，如果您使用的是 Git 仓库：

\`\`\`bash
# 在服务器上
cd ~/medical-records
git clone https://github.com/your-username/medical-records.git .
\`\`\`

### 4. 部署应用

在服务器上执行以下命令：

\`\`\`bash
cd ~/medical-records
chmod +x deploy.sh
./deploy.sh
\`\`\`

### 5. 验证部署

应用部署完成后，可以通过以下方式访问：

- 在服务器内部: http://localhost
- 从外部访问: http://218.29.70.36:14980

## 故障排除

### 检查容器状态

\`\`\`bash
docker ps
\`\`\`

### 查看容器日志

\`\`\`bash
docker logs medical-records-app
\`\`\`

### 检查端口映射

\`\`\`bash
netstat -tulpn | grep 80
\`\`\`

### 检查防火墙设置

确保服务器防火墙允许 14980 端口的外部访问：

\`\`\`bash
sudo iptables -L -n
\`\`\`

## 更新应用

当有新版本需要部署时：

\`\`\`bash
cd ~/medical-records

# 如果使用 Git
git pull

# 重新部署
./deploy.sh
\`\`\`

## 备份数据

由于应用使用 localStorage 存储数据，数据实际上存储在用户的浏览器中。在生产环境中，建议实现一个后端 API 和数据库来持久化存储数据。
