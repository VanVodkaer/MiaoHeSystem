const { Product, ProductCategory } = require("../models");
const logger = require("../utils/logger");
const Joi = require("joi");

// 定义更新商品的验证规则
const updateProductSchema = Joi.object({
  category_id: Joi.number().integer().positive(),
  name: Joi.string().max(150),
  description: Joi.string(),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  image_url: Joi.string().uri(),
  status: Joi.number().integer().valid(0, 1),
}).min(1); // 至少提供一个字段

module.exports = {
  // 创建商品
  async createProduct(req, res) {
    try {
      const { category_id, name, description, price, stock, image_url, status } = req.body;

      // 验证分类是否存在
      const category = await ProductCategory.findByPk(category_id);
      if (!category) {
        logger.warn("创建商品失败：分类未找到，分类ID: %d", category_id);
        return res.status(404).json({ message: "分类未找到" });
      }

      // 创建商品
      const product = await Product.create({
        category_id,
        name,
        description,
        price,
        stock,
        image_url,
        status,
      });

      logger.info("创建商品成功: 商品ID %d", product.product_id);
      res.status(201).json(product);
    } catch (error) {
      logger.error("创建商品失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 获取所有商品
  async getAllProducts(req, res) {
    try {
      const { category_id } = req.query;
      const whereClause = {};

      if (category_id) {
        whereClause.category_id = category_id;
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [{ model: ProductCategory, as: "category" }],
      });
      res.status(200).json(products);
    } catch (error) {
      logger.error("获取商品列表失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 获取单个商品
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: ProductCategory, as: "category" }],
      });
      if (!product) {
        logger.warn("获取商品失败：商品未找到，商品ID: %d", id);
        return res.status(404).json({ message: "商品未找到" });
      }
      res.status(200).json(product);
    } catch (error) {
      logger.error("获取商品失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 更新商品信息
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // 验证请求体
      const { error } = updateProductSchema.validate(updates);
      if (error) {
        logger.warn("更新商品验证失败：%s", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
      }

      // 查找商品
      const product = await Product.findByPk(id);
      if (!product) {
        logger.warn("更新商品失败：商品未找到，商品ID: %d", id);
        return res.status(404).json({ message: "商品未找到" });
      }

      // 更新商品信息
      await product.update(updates);

      logger.info("更新商品成功: 商品ID %d", id);
      res.status(200).json(product);
    } catch (error) {
      logger.error("更新商品失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },

  // 删除商品
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        logger.warn("删除商品失败：商品未找到，商品ID: %d", id);
        return res.status(404).json({ message: "商品未找到" });
      }
      await product.destroy();
      logger.info("删除商品成功: 商品ID %d", id);
      res.status(204).send();
    } catch (error) {
      logger.error("删除商品失败: %s", error.message);
      res.status(500).json({ message: "服务器错误", error: error.message });
    }
  },
};
