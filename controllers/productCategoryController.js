const { ProductCategory } = require("../models");
const logger = require("../utils/logger");

module.exports = {
  // 创建商品分类
  async createCategory(req, res) {
    try {
      const { name, description, parent_id } = req.body;
      const category = await ProductCategory.create({ name, description, parent_id });
      logger.info("创建商品分类成功: 分类ID %d", category.category_id);
      res.status(201).json(category);
    } catch (error) {
      logger.error("创建商品分类失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 获取所有商品分类
  async getAllCategories(req, res) {
    try {
      const categories = await ProductCategory.findAll();
      res.status(200).json(categories);
    } catch (error) {
      logger.error("获取商品分类失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 获取单个商品分类
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await ProductCategory.findByPk(id);
      if (!category) {
        logger.warn("商品分类未找到: 分类ID %d", id);
        return res.status(404).json({ message: "商品分类未找到" });
      }
      res.status(200).json(category);
    } catch (error) {
      logger.error("获取商品分类失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 更新商品分类
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, parent_id } = req.body;
      const category = await ProductCategory.findByPk(id);
      if (!category) {
        logger.warn("商品分类未找到: 分类ID %d", id);
        return res.status(404).json({ message: "商品分类未找到" });
      }
      await category.update({ name, description, parent_id });
      logger.info("更新商品分类成功: 分类ID %d", id);
      res.status(200).json(category);
    } catch (error) {
      logger.error("更新商品分类失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 删除商品分类
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await ProductCategory.findByPk(id);
      if (!category) {
        logger.warn("商品分类未找到: 分类ID %d", id);
        return res.status(404).json({ message: "商品分类未找到" });
      }
      await category.destroy();
      logger.info("删除商品分类成功: 分类ID %d", id);
      res.status(204).send();
    } catch (error) {
      logger.error("删除商品分类失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },
};
