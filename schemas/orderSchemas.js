const Joi = require("joi");

// 定义订单验证模式
const orderSchema = Joi.object({
  user_id: Joi.number().integer().required().label("用户ID"), // 用户ID，必填，整数
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().required().label("商品ID"), // 商品ID，必填，整数
        quantity: Joi.number().integer().min(1).required().label("数量"), // 数量，必填，最小值为1
      })
    )
    .min(1) // 至少包含一个订单项
    .required()
    .label("订单项"), // 订单项，必填，数组
  payment_method: Joi.string().max(50).optional().allow(null, "").label("支付方式"), // 支付方式，可选，允许为空或null
  payment_id: Joi.string().max(100).optional().allow(null, "").label("支付ID"), // 支付ID，可选，允许为空或null
});

module.exports = {
  orderSchema,
};
