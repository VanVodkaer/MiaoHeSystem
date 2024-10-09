const jwt = require("jsonwebtoken"); // 导入 jsonwebtoken 库
const logger = require("../utils/logger"); // 导入 logger 工具

// 授权中间件，接收所需的权限级别
const authorize = (requiredPermissionLevel) => {
  return (req, res, next) => {
    // 从请求头中提取 token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // 期望格式: "Bearer TOKEN"

    if (!token) {
      logger.warn("无效的令牌，IP: %s", req.ip); // 记录警告日志
      return res.status(401).json({ message: "无效的令牌" }); // 返回 401 状态码
    }

    // 验证 token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn("无效的令牌，IP: %s", req.ip); // 记录警告日志
        return res.status(403).json({ message: "无效的令牌" }); // 返回 403 状态码
      }

      // 检查用户权限级别
      if (user.permission_level < requiredPermissionLevel) {
        logger.warn("用户ID %s 权限不足，尝试访问需要等级 %s 的资源", user.user_id, requiredPermissionLevel); // 记录警告日志
        return res.status(403).json({ message: "权限不足" }); // 返回 403 状态码
      }

      req.user = user; // 将用户信息附加到请求对象
      next(); // 继续执行下一个中间件
    });
  };
};

module.exports = authorize;
