const logger = require("../utils/logger");

// 请求日志记录中间件
const requestLogger = (req, res, next) => {
  // 记录每个进入的请求，包括请求方法、URL 和客户端 IP 地址
  logger.info("Incoming Request: %s %s from %s", req.method, req.url, req.ip);

  // 继续执行下一个中间件
  next();
};

module.exports = requestLogger;
