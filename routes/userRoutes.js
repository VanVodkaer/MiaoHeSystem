const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 微信小程序登录（公开访问，无需身份验证）
router.post("/weixin-login", userController.weixinLogin);

// 获取所有用户（仅管理员可访问，需身份验证和授权）
router.get("/", authenticateToken, authorize(1), userController.getAllUsers);

// 获取单个用户信息（仅管理员可访问，需身份验证和授权）
router.get("/:id", authenticateToken, authorize(1), userController.getUserById);

// 更新用户信息（仅管理员可访问，需身份验证和授权）
router.put("/:id", authenticateToken, authorize(1), userController.updateUser);

// 删除用户（仅管理员可访问，需身份验证和授权）
router.delete("/:id", authenticateToken, authorize(1), userController.deleteUser);

module.exports = router;
