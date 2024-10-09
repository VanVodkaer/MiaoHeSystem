const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const dotenv = require("dotenv");

dotenv.config();

// 认证中间件
const authenticateToken = (req, res, next) => {
  try {
    // 从请求头中获取 token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // 期望格式: "Bearer TOKEN"

    if (!token) {
      logger.warn(`未提供令牌，IP: ${req.ip}`); // 未提供令牌时记录警告日志
      return res.status(401).json({ message: "访问被拒绝：未提供令牌" }); // 返回 401 状态码
    }

    // 验证令牌
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn(`无效的令牌，IP: ${req.ip}`); // 无效令牌时记录警告日志
        return res.status(403).json({ message: "无效的令牌" }); // 返回 403 状态码
      }
      req.user = user; // 将用户信息附加到请求对象
      next(); // 继续执行下一个中间件
    });
  } catch (error) {
    logger.error(`认证中间件出错: ${error.message}`); // 发生错误时记录错误日志
    res.status(500).json({ message: "服务器内部错误" }); // 返回 500 状态码
  }
};

module.exports = authenticateToken;
