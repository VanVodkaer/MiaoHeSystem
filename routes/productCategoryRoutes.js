const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/productCategoryController");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 创建商品分类（仅管理员）
router.post("/", authenticateToken, authorize(1), productCategoryController.createCategory);

// 获取所有商品分类（公开）
router.get("/", productCategoryController.getAllCategories);

// 获取单个商品分类（公开）
router.get("/:id", productCategoryController.getCategoryById);

// 更新商品分类（仅管理员）
router.put("/:id", authenticateToken, authorize(1), productCategoryController.updateCategory);

// 删除商品分类（仅管理员）
router.delete("/:id", authenticateToken, authorize(1), productCategoryController.deleteCategory);

module.exports = router;
