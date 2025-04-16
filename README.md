# 杨墨病例管理系统

## 项目简介
杨墨病例管理系统是一个用于病例记录管理的辅助软件，旨在帮助医疗工作者高效地录入、管理和查看病例信息。该项目提供了用户友好的界面，支持病例的新增、搜索和详细查看功能。

## 功能特性
- **病例录入**: 用户可以通过 `PatientForm` 组件录入病例信息，包括病例名称、病症名称、联系方式、性别、年龄和诊断记录。
- **病例列表**: `RecordList` 组件展示所有病例信息，并支持搜索功能，方便用户快速查找所需病例。
- **病例详情**: `RecordDetails` 组件允许用户查看病例的详细信息，并提供新增和修改诊断记录的功能。
- **主界面**: `HomePage` 组件整合了搜索框、新增病例按钮和病例列表，布局合理，操作方便。
- **新增病例页面**: `PatientPage` 组件专门用于录入新的病例信息。
- **病例详情页面**: `RecordPage` 组件用于显示病例的详细信息和所有诊断记录。

## 技术栈
- **前端**: React, TypeScript
- **后端**: 通过 API 与后端交互（具体实现见 `src/services/api.ts`）
- **数据模拟**: 使用 `mockData.ts` 提供开发和测试阶段的模拟数据

## 文件结构
```
medical-record-assistant
├── src
│   ├── components
│   │   ├── PatientForm.tsx
│   │   ├── RecordList.tsx
│   │   └── RecordDetails.tsx
│   ├── pages
│   │   ├── HomePage.tsx
│   │   ├── PatientPage.tsx
│   │   └── RecordPage.tsx
│   ├── services
│   │   ├── api.ts
│   │   └── mockData.ts
│   ├── utils
│   │   └── helpers.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## 安装与运行
1. 克隆项目到本地:
   ```
   git clone <repository-url>
   ```
2. 进入项目目录:
   ```
   cd medical-record-assistant
   ```
3. 安装依赖:
   ```
   npm install
   ```
4. 启动开发服务器:
   ```
   npm start
   ```

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
该项目遵循 MIT 许可证。