# MiaoHeSystem

<div align="center">
  <img src="Logo.png" alt="MiaoHeSystem Logo" width="100"/>
  <br>
  <span>简体中文 | <a href="README-en_US.md">English</a></span>
  <br>
  MiaoHeSystem: 喵和微信小程序的后端系统 🚀
</div>

## 项目简介

MiaoHeSystem 是为喵和微信小程序设计的后端系统，负责处理用户认证、商品管理、订单处理和微信支付等核心功能。该项目基于 Node.js 进行开发，主要依赖 Express 框架，并结合 Sequelize 管理数据库。此外，该项目的开发过程中大量使用了 ChatGPT 进行辅助开发。

## 技术栈

- **Node.js**: 后端主框架，用于处理 HTTP 请求与响应。
- **Express**: 基于 Node.js 的 Web 应用框架，用于构建 API。
- **Sequelize**: ORM（对象关系映射），用于简化数据库操作。
- **MySQL**: 项目的数据库，存储用户、订单、商品等数据。
- **JWT**: 用于用户认证和授权。
- **微信支付 API**: 集成微信支付，处理支付相关功能。

## 功能模块

- **用户管理**: 注册、登录、权限管理（基于 JWT）。
- **商品管理**: 商品的创建、更新、删除和查询。
- **订单管理**: 创建、更新、查看订单状态，管理员查看所有订单。
- **支付功能**: 微信支付的集成与支付回调处理。
- **日志记录**: 使用 Winston 进行日志管理，保存重要操作日志。

## 项目配置

项目运行前需要在根目录下创建 `.env` 文件，配置项目所需的环境变量。参考 `.env.example` 文件进行配置：

```bash
# 环境变量 development/test/production
NODE_ENV=development

# 服务器端口
PORT=3000

# JWT 密钥，用于签名和验证 JWT 令牌
JWT_SECRET=your_secure_jwt_secret_key

# 微信小程序的 appid 和 secret
APPID=your_wechat_appid
SECRET=your_wechat_secret

# 数据库配置
DB_DIALECT=mysql
DB_HOST_DEV=localhost
DB_NAME_DEV=miaohe_dev
DB_USERNAME_DEV=your_username
DB_PASSWORD_DEV=your_password

# 微信支付配置
WECHAT_APPID=your_wechat_appid
WECHAT_MCHID=your_wechat_mchid
WECHAT_API_PRIVATE_KEY_PATH=./apiclient_key.pem
WECHAT_API_CLIENT_CERT_PATH=./apiclient_cert.pem
WECHAT_API_CLIENT_KEY_PATH=./apiclient_key.pem
WECHAT_API_CERT_SERIAL_NO=your_certificate_serial_number
WECHAT_API_V3_KEY=your_apiv3_key
WECHAT_PAY_NOTIFY_URL=https://your_domain/api/payment/wxpay/notify
```

## 开发与运行指南

### 启动项目

使用以下命令来启动项目：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行项目：
   ```bash
   npm run start
   ```

### 开发环境

在开发环境中，使用 Nodemon 监听文件变化，自动重启服务器：

```bash
npm run dev
```

### 数据库迁移和同步

在项目中，我们使用 Sequelize 进行数据库操作。在第一次启动项目之前，需要进行数据库迁移和同步：

```bash
# 运行数据库迁移
npx sequelize-cli db:migrate

# 如果你需要自动同步模型到数据库，可以使用 sequelize.sync()
```

### 相关文档

[API文档](./doc/API文档.md)
[数据表结构说明](./doc/数据表结构说明.md)

### 项目开发辅助

本项目开发过程中主要依靠 ChatGPT 的辅助。
