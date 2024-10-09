require("dotenv").config();

// 获取当前环境，默认为 'development'
const env = process.env.NODE_ENV || "development";

// 基础配置，可以根据需要调整
const baseConfig = {
  dialect: process.env.DB_DIALECT || "mysql", // 数据库类型，默认为 MySQL
  logging: false, // 禁用日志输出
};

// 按环境划分配置
const config = {
  development: {
    username: process.env.DB_USERNAME_DEV || "root", // 开发环境用户名
    password: process.env.DB_PASSWORD_DEV || null, // 开发环境密码
    database: process.env.DB_NAME_DEV || "miaonvmc_store", // 开发环境数据库名
    host: process.env.DB_HOST_DEV || "127.0.0.1", // 开发环境主机地址
    ...baseConfig, // 合并基础配置
  },
  test: {
    username: process.env.DB_USERNAME_TEST || "test_user", // 测试环境用户名
    password: process.env.DB_PASSWORD_TEST || "test_password", // 测试环境密码
    database: process.env.DB_NAME_TEST || "miaonvmc_store_test", // 测试环境数据库名
    host: process.env.DB_HOST_TEST || "127.0.0.1", // 测试环境主机地址
    ...baseConfig, // 合并基础配置
  },
  production: {
    username: process.env.DB_USERNAME || "prod_user", // 生产环境用户名
    password: process.env.DB_PASSWORD || "prod_password", // 生产环境密码
    database: process.env.DB_NAME || "miaonvmc_store_prod", // 生产环境数据库名
    host: process.env.DB_HOST || "127.0.0.1", // 生产环境主机地址
    ...baseConfig, // 合并基础配置
  },
};

module.exports = config;
