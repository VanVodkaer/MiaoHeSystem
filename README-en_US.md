# MiaoHeSystem

<div align="center">
  <img src="Logo.png" alt="MiaoHeSystem Logo" width="100"/>
  <br>
  <span><a href="README.md">简体中文</a> | English</span>
  <br>
  MiaoHeSystem: Backend system for MiaoHe WeChat Mini Program 🚀
</div>

## Project Overview

MiaoHeSystem is a backend system designed for the MiaoHe WeChat Mini Program. It handles core functionalities like user authentication, product management, order processing, and WeChat payment integration. This project is developed using Node.js, primarily leveraging the Express framework, and employs Sequelize for database management. Additionally, ChatGPT was heavily involved in assisting with the development process.

## Tech Stack

- **Node.js**: Main backend framework, responsible for handling HTTP requests and responses.
- **Express**: A web application framework built on Node.js, used to create APIs.
- **Sequelize**: ORM (Object Relational Mapping) used to simplify database operations.
- **MySQL**: The project’s database, storing data such as users, orders, and products.
- **JWT**: Utilized for user authentication and authorization.
- **WeChat Payment API**: Integrated to handle payment processing and callbacks.

## Modules

- **User Management**: Includes registration, login, and role management (JWT-based).
- **Product Management**: Allows creation, updating, deletion, and querying of products.
- **Order Management**: Enables creating, updating, and viewing order statuses, with administrators able to access all orders.
- **Payment Features**: Integration with WeChat payment, including payment callbacks.
- **Logging**: Logs important actions using Winston for log management.

## Project Configuration

Before running the project, an `.env` file must be created in the root directory to set up the necessary environment variables. Refer to the `.env.example` file for configuration:

```bash
# Environment variable: development/test/production
NODE_ENV=development

# Server port
PORT=3000

# JWT secret, used for signing and verifying JWT tokens
JWT_SECRET=your_secure_jwt_secret_key

# WeChat Mini Program appid and secret
APPID=your_wechat_appid
SECRET=your_wechat_secret

# Database configuration
DB_DIALECT=mysql
DB_HOST_DEV=localhost
DB_NAME_DEV=miaohe_dev
DB_USERNAME_DEV=your_username
DB_PASSWORD_DEV=your_password

# WeChat payment configuration
WECHAT_APPID=your_wechat_appid
WECHAT_MCHID=your_wechat_mchid
WECHAT_API_PRIVATE_KEY_PATH=./apiclient_key.pem
WECHAT_API_CLIENT_CERT_PATH=./apiclient_cert.pem
WECHAT_API_CLIENT_KEY_PATH=./apiclient_key.pem
WECHAT_API_CERT_SERIAL_NO=your_certificate_serial_number
WECHAT_API_V3_KEY=your_apiv3_key
WECHAT_PAY_NOTIFY_URL=https://your_domain/api/payment/wxpay/notify
```

## Development and Running Guide

### Starting the Project

Use the following commands to start the project:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the project:
   ```bash
   npm run start
   ```

### Development Environment

In development mode, use Nodemon to watch for file changes and automatically restart the server:

```bash
npm run dev
```

### Database Migration and Synchronization

This project uses Sequelize for database operations. Before starting the project for the first time, database migrations and synchronizations need to be performed:

```bash
# Run database migrations
npx sequelize-cli db:migrate

# If you need to automatically sync models to the database, use sequelize.sync()
```

### Documentation

[API Documentation](./doc/API_Documentation.md)  
[Database Schema Explanation](./doc/Database_Schema.md)

### Development Assistance

ChatGPT was extensively used throughout the development of this project.