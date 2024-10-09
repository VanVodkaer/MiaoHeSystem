const { Order, OrderItem, Product, User, sequelize } = require("../models");
const { orderSchema } = require("../schemas/orderSchemas");
const logger = require("../utils/logger");
const moment = require("moment");

exports.createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      logger.warn("创建订单验证失败: %s", error.details[0].message);
      await transaction.rollback();
      return res.status(400).json({ message: error.details[0].message });
    }

    let { user_id, items, payment_method, payment_id } = value;
    payment_method = payment_method || null;
    payment_id = payment_id || null;

    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      logger.warn("创建订单失败：用户未找到，用户ID: %s", user_id);
      await transaction.rollback();
      return res.status(404).json({ message: "用户未找到" });
    }

    let total_amount = 0.0;

    // 验证商品库存并计算总金额
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction });
      if (!product) {
        logger.warn("创建订单失败：商品未找到，商品ID: %s", item.product_id);
        await transaction.rollback();
        return res.status(404).json({ message: `商品未找到，商品ID: ${item.product_id}` });
      }

      if (product.stock < item.quantity) {
        logger.warn("商品库存不足，商品ID: %s", item.product_id);
        await transaction.rollback();
        return res.status(400).json({ message: `商品库存不足，商品ID: ${item.product_id}` });
      }

      total_amount += parseFloat(product.price) * item.quantity;
    }

    // 生成自定义订单号
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const order_id = `${user_id}-${timestamp}`;

    // 创建订单
    const newOrder = await Order.create(
      {
        order_id,
        user_id,
        total_amount: total_amount.toFixed(2),
        status: 0, // 待支付
        payment_method,
        payment_id,
      },
      { transaction }
    );

    // 创建订单项并扣减库存
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction });
      await OrderItem.create(
        {
          order_id: newOrder.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          total_price: (parseFloat(product.price) * item.quantity).toFixed(2),
        },
        { transaction }
      );

      // 扣减库存
      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    await transaction.commit();
    logger.info("创建订单成功: 订单ID %s", newOrder.order_id);
    res.status(201).json(newOrder);
  } catch (error) {
    await transaction.rollback();
    logger.error("创建订单时出错: %s", error.message);
    next(error);
  }
};

// 获取所有订单
exports.getAllOrders = async (req, res, next) => {
  try {
    const user = req.user;
    let orders;

    if (user.permission_level >= 1) {
      // 管理员获取所有订单
      orders = await Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "nickname", "email"],
          },
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["product_id", "name", "price"],
              },
            ],
          },
        ],
      });
    } else {
      // 普通用户获取自己的订单
      orders = await Order.findAll({
        where: { user_id: user.user_id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "nickname", "email"],
          },
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["product_id", "name", "price"],
              },
            ],
          },
        ],
      });
    }
    logger.info("获取订单，数量: %s", orders.length);
    res.json(orders);
  } catch (error) {
    logger.error("获取所有订单时出错: %s", error.message);
    next(error);
  }
};

// 获取单个订单
exports.getOrderById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "nickname", "email"],
        },
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name", "price"],
            },
          ],
        },
      ],
    });
    if (!order) {
      logger.warn("获取订单失败：订单未找到，订单ID: %s", id);
      return res.status(404).json({ message: "订单未找到" });
    }

    const user = req.user;

    // 检查是否为管理员或订单所有者
    if (user.permission_level < 1 && order.user_id !== user.user_id) {
      logger.warn("用户ID %s 尝试访问非自己订单，订单ID: %s", user.user_id, id);
      return res.status(403).json({ message: "权限不足" });
    }

    res.json(order);
  } catch (error) {
    logger.error("获取单个订单时出错: %s", error.message);
    next(error);
  }
};

// 更新订单
exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { status, payment_method, payment_id } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      logger.warn("更新订单失败：订单未找到，订单ID: %s", id);
      return res.status(404).json({ message: "订单未找到" });
    }

    // 更新字段
    if (status !== undefined) order.status = status;
    if (payment_method !== undefined) order.payment_method = payment_method;
    if (payment_id !== undefined) order.payment_id = payment_id;

    await order.save();
    logger.info("更新订单成功: 订单ID %s", order.order_id);
    res.json(order);
  } catch (error) {
    logger.error("更新订单时出错: %s", error.message);
    next(error);
  }
};

// 删除订单
exports.deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      logger.warn("删除订单失败：订单未找到，订单ID: %s", id);
      return res.status(404).json({ message: "订单未找到" });
    }

    await order.destroy();
    logger.info("删除订单成功: 订单ID %s", id);
    res.status(204).send();
  } catch (error) {
    logger.error("删除订单时出错: %s", error.message);
    next(error);
  }
};
