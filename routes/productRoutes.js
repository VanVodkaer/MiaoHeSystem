const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 创建新商品 - 仅管理员可访问
router.post("/", authenticateToken, authorize(1), productController.createProduct);

// 获取所有商品 - 公开访问
router.get("/", productController.getAllProducts);

// 获取单个商品 - 公开访问
router.get("/:id", productController.getProductById);

// 更新商品信息 - 仅管理员可访问
router.put("/:id", authenticateToken, authorize(1), productController.updateProduct);

// 删除商品 - 仅管理员可访问
router.delete("/:id", authenticateToken, authorize(1), productController.deleteProduct);

module.exports = router;
