const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 创建新订单（所有已登录用户可访问）
router.post("/", authenticateToken, orderController.createOrder);

// 获取所有订单（管理员可访问，普通用户获取自己的订单）
router.get("/", authenticateToken, orderController.getAllOrders);

// 获取单个订单（管理员可访问，普通用户获取自己的订单）
router.get("/:id", authenticateToken, orderController.getOrderById);

// 更新订单（仅管理员可访问）
router.put("/:id", authenticateToken, authorize(1), orderController.updateOrder);

// 删除订单（仅管理员可访问）
router.delete("/:id", authenticateToken, authorize(1), orderController.deleteOrder);

module.exports = router;
