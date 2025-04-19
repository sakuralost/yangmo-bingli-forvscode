# 病例记录辅助软件 API 文档

## 概述

本文档详细描述了病例记录辅助软件的 RESTful API 接口。这些接口支持病例的创建、查询、更新和删除，以及诊断记录的管理。

## 基础信息

- **基础URL**: `https://api.example.com/v1`
- **认证方式**: Bearer Token
- **响应格式**: JSON

## 认证

所有 API 请求需要在 HTTP 头部包含有效的认证令牌：

\`\`\`
Authorization: Bearer {token}
\`\`\`

### 获取令牌

\`\`\`
POST /auth/login
\`\`\`

**请求体**:

\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**响应**:

\`\`\`json
{
  "token": "string",
  "expires": "string (ISO 8601 日期时间)"
}
\`\`\`

## API 端点

### 病例管理

#### 获取病例列表

\`\`\`
GET /cases
\`\`\`

**查询参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| page | integer | 页码，默认为 1 |
| limit | integer | 每页记录数，默认为 20 |
| sort | string | 排序字段，可选值: name, createdAt, lastDiagnosisTime |
| order | string | 排序方向，可选值: asc, desc |

**响应**:

\`\`\`json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "symptom": "string",
      "contact": "string",
      "gender": "string",
      "age": "number",
      "lastDiagnosisTime": "string (ISO 8601 日期时间)",
      "createdAt": "string (ISO 8601 日期时间)",
      "updatedAt": "string (ISO 8601 日期时间)"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
\`\`\`

#### 搜索病例

\`\`\`
GET /cases/search
\`\`\`

**查询参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| q | string | 搜索关键词，可匹配病例名称、病症名称、联系方式和诊断记录 |
| page | integer | 页码，默认为 1 |
| limit | integer | 每页记录数，默认为 20 |

**响应**:

\`\`\`json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "symptom": "string",
      "contact": "string",
      "gender": "string",
      "age": "number",
      "lastDiagnosisTime": "string (ISO 8601 日期时间)",
      "createdAt": "string (ISO 8601 日期时间)",
      "updatedAt": "string (ISO 8601 日期时间)"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
\`\`\`

#### 创建病例

\`\`\`
POST /cases
\`\`\`

**请求体**:

\`\`\`json
{
  "name": "string (必填)",
  "symptom": "string",
  "contact": "string",
  "gender": "string",
  "age": "number",
  "diagnosis": "string (必填)"
}
\`\`\`

**响应**:

\`\`\`json
{
  "id": "string",
  "name": "string",
  "symptom": "string",
  "contact": "string",
  "gender": "string",
  "age": "number",
  "lastDiagnosisTime": "string (ISO 8601 日期时间)",
  "createdAt": "string (ISO 8601 日期时间)",
  "updatedAt": "string (ISO 8601 日期时间)",
  "diagnoses": [
    {
      "id": "string",
      "content": "string",
      "createdAt": "string (ISO 8601 日期时间)",
      "updatedAt": "string (ISO 8601 日期时间)"
    }
  ]
}
\`\`\`

#### 获取病例详情

\`\`\`
GET /cases/{id}
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| id | string | 病例ID |

**响应**:

\`\`\`json
{
  "id": "string",
  "name": "string",
  "symptom": "string",
  "contact": "string",
  "gender": "string",
  "age": "number",
  "lastDiagnosisTime": "string (ISO 8601 日期时间)",
  "createdAt": "string (ISO 8601 日期时间)",
  "updatedAt": "string (ISO 8601 日期时间)",
  "diagnoses": [
    {
      "id": "string",
      "content": "string",
      "createdAt": "string (ISO 8601 日期时间)",
      "updatedAt": "string (ISO 8601 日期时间)"
    }
  ]
}
\`\`\`

#### 更新病例

\`\`\`
PUT /cases/{id}
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| id | string | 病例ID |

**请求体**:

\`\`\`json
{
  "name": "string",
  "symptom": "string",
  "contact": "string",
  "gender": "string",
  "age": "number"
}
\`\`\`

**响应**:

\`\`\`json
{
  "id": "string",
  "name": "string",
  "symptom": "string",
  "contact": "string",
  "gender": "string",
  "age": "number",
  "lastDiagnosisTime": "string (ISO 8601 日期时间)",
  "createdAt": "string (ISO 8601 日期时间)",
  "updatedAt": "string (ISO 8601 日期时间)"
}
\`\`\`

#### 删除病例

\`\`\`
DELETE /cases/{id}
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| id | string | 病例ID |

**响应**:

\`\`\`json
{
  "success": true,
  "message": "病例已成功删除"
}
\`\`\`

### 诊断记录管理

#### 添加诊断记录

\`\`\`
POST /cases/{caseId}/diagnoses
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| caseId | string | 病例ID |

**请求体**:

\`\`\`json
{
  "content": "string (必填)"
}
\`\`\`

**响应**:

\`\`\`json
{
  "id": "string",
  "content": "string",
  "createdAt": "string (ISO 8601 日期时间)",
  "updatedAt": "string (ISO 8601 日期时间)"
}
\`\`\`

#### 获取诊断记录列表

\`\`\`
GET /cases/{caseId}/diagnoses
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| caseId | string | 病例ID |

**响应**:

\`\`\`json
{
  "data": [
    {
      "id": "string",
      "content": "string",
      "createdAt": "string (ISO 8601 日期时间)",
      "updatedAt": "string (ISO 8601 日期时间)"
    }
  ]
}
\`\`\`

#### 更新诊断记录

\`\`\`
PUT /cases/{caseId}/diagnoses/{diagId}
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| caseId | string | 病例ID |
| diagId | string | 诊断记录ID |

**请求体**:

\`\`\`json
{
  "content": "string (必填)"
}
\`\`\`

**响应**:

\`\`\`json
{
  "id": "string",
  "content": "string",
  "createdAt": "string (ISO 8601 日期时间)",
  "updatedAt": "string (ISO 8601 日期时间)"
}
\`\`\`

#### 删除诊断记录

\`\`\`
DELETE /cases/{caseId}/diagnoses/{diagId}
\`\`\`

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| caseId | string | 病例ID |
| diagId | string | 诊断记录ID |

**响应**:

\`\`\`json
{
  "success": true,
  "message": "诊断记录已成功删除"
}
\`\`\`

### 图片上传

#### 上传图片

\`\`\`
POST /upload/images
\`\`\`

**请求体**:

使用 `multipart/form-data` 格式上传图片文件。

| 参数名 | 类型 | 描述 |
|--------|------|------|
| file | file | 图片文件 |

**响应**:

\`\`\`json
{
  "url": "string",
  "filename": "string",
  "size": "number",
  "mimetype": "string"
}
\`\`\`

## 错误响应

所有 API 错误响应都遵循以下格式：

\`\`\`json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (可选)"
  }
}
\`\`\`

### 常见错误代码

| 错误代码 | 描述 |
|----------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |
\`\`\`

```gitignore file=".gitignore"
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
