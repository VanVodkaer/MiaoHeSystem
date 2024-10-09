// app.js

// 加载环境变量
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models"); // 引入 sequelize 实例
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const logger = require("./utils/logger"); // 导入日志工具

const app = express();

// 中间件配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 添加解析原始请求体的中间件
app.use(
  bodyParser.raw({
    type: "application/json",
  })
);

// 请求日志记录中间件
app.use(requestLogger);

// 路由配置
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/categories", productCategoryRoutes);
app.use("/api/payment", paymentRoutes);

// 全局错误处理中间件
app.use(errorHandler);

// 导出 app 以供测试使用
module.exports = app;

// 启动服务器逻辑
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;

  // 开发环境下打印环境变量
  if (process.env.NODE_ENV === "development") {
    console.log(process.env);
  }

  // 检查 Sequelize 是否正确初始化
  if (!sequelize) {
    throw new Error("Sequelize 未被正确初始化");
  }

  // 异步启动服务器并同步数据库
  (async () => {
    try {
      // 验证数据库连接
      await sequelize.authenticate();
      logger.info("数据库连接成功");

      // 根据环境变量决定是否修改表结构
      const alterSync = process.env.NODE_ENV === "development";

      // 同步数据库表
      await sequelize.sync({ alter: alterSync });
      logger.info("模型同步到数据库完成");

      // 启动服务器
      app.listen(PORT, () => {
        logger.info(`服务器正在运行在端口 ${PORT}`);
      });
    } catch (err) {
      logger.error("数据库连接失败:", err);
    }
  })();

  // 处理未捕获的异常
  process.on("uncaughtException", (error) => {
    logger.error("未捕获的异常: %s", error.message);
    process.exit(1); // 退出进程
  });

  // 处理未处理的 Promise 拒绝
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("未处理的 Promise 拒绝: %s, 原因: %s", promise, reason);
  });
}
