# 病例记录辅助软件

一款简单易用的病例记录辅助软件，帮助医生高效地记录和管理病例信息。

## 功能特点

- 病例信息管理：创建、查看和更新病例信息
- 诊断记录管理：为病例添加和修改诊断记录
- 搜索功能：根据病例名称、病症名称和联系方式搜索病例
- 响应式设计：适配桌面和移动设备

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui 组件库

## 快速开始

\`\`\`bash
# 克隆仓库
git clone https://github.com/您的用户名/medical-records.git

# 进入项目目录
cd medical-records

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

\`\`\`
medical-records/
├── app/                  # Next.js 应用目录
│   ├── page.tsx          # 主页面 - 病例列表
│   ├── add-case/         # 新增病例页面
│   └── case/[id]/        # 病例详情页面
├── components/           # UI 组件
├── lib/                  # 工具函数
└── public/               # 静态资源
\`\`\`

## API 文档

详细的 API 文档请参见 [API.md](API.md) 文件。

## 许可证

MIT
