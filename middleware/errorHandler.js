const logger = require("../utils/logger");

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误的名称、消息和堆栈信息
  logger.error("%s %s %s", err.name, err.message, err.stack);

  // 返回 500 状态码以及通用的错误信息
  res.status(500).json({ message: "服务器内部错误" });
};

module.exports = errorHandler;
