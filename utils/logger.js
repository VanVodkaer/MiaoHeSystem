// logger.js

const { createLogger, format, transports } = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

// 定义日志格式
const logFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss", // 时间戳格式
  }),
  format.errors({ stack: true }), // 捕获错误堆栈
  format.splat(), // 支持字符串插值
  format.json() // 输出为 JSON 格式
);

// 创建 logger 实例
const logger = createLogger({
  level: "info", // 默认日志级别
  format: logFormat,
  defaultMeta: { service: "miaonvmc_store_service" }, // 默认元数据
  transports: [
    // 写入所有级别日志到 daily combined.log 文件 (按日期分割)
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/combined-%DATE%.log"), // 日志文件路径
      datePattern: "YYYY-MM-DD", // 按日期分割
      zippedArchive: true, // 压缩归档旧日志
      maxSize: "20m", // 最大文件大小 20MB
      maxFiles: "14d", // 保留 14 天的日志文件
    }),

    // 写入错误级别日志到 daily error.log 文件
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/error-%DATE%.log"), // 错误日志文件
      level: "error", // 仅记录 error 级别日志
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    // 写入警告级别日志到 daily warn.log 文件
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/warn-%DATE%.log"), // 警告日志文件
      level: "warn", // 仅记录 warn 级别日志
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// 如果不是生产环境，则输出到控制台
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(), // 彩色输出
        format.simple(), // 简单格式，适合控制台查看
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`; // 自定义控制台输出格式
        })
      ),
    })
  );
}

module.exports = logger;
