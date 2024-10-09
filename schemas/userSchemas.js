const Joi = require("joi");

// 用户注册验证模式
const registerSchema = Joi.object({
  openid: Joi.string().max(64).required(), // 用户的唯一标识符，必填，最大长度为64
  nickname: Joi.string().max(50).required(), // 用户昵称，必填，最大长度为50
  avatar_url: Joi.string().uri().optional(), // 头像URL，可选，必须是合法的URI
  gender: Joi.number().integer().min(0).max(2).optional(), // 性别，可选，值为0-2的整数
  phone: Joi.string().max(20).optional(), // 电话号码，可选，最大长度为20
  email: Joi.string().email().max(100).optional(), // 邮箱地址，可选，格式合法，最大长度为100
  password: Joi.alternatives().try(Joi.string().min(8), Joi.allow(null)), // 密码，支持null，最小长度为8
  permission_level: Joi.number().integer().min(0).max(1).optional(), // 用户权限等级，可选，0或1
});

// 用户更新验证模式
const updateUserSchema = Joi.object({
  openid: Joi.string().max(64).optional(), // 用户的唯一标识符，可选
  nickname: Joi.string().max(50).optional(), // 用户昵称，可选
  avatar_url: Joi.string().uri().optional(), // 头像URL，可选
  gender: Joi.number().integer().min(0).max(2).optional(), // 性别，可选，值为0-2的整数
  phone: Joi.string().max(20).optional(), // 电话号码，可选
  email: Joi.string().email().max(100).optional(), // 邮箱地址，可选
  password: Joi.alternatives().try(Joi.string().min(8), Joi.allow(null)), // 密码，支持null，最小长度为8
  permission_level: Joi.number().integer().min(0).max(1).optional(), // 用户权限等级，可选
}).min(1); // 至少需要提供一个字段进行更新

// 用户登录验证模式
const loginSchema = Joi.object({
  openid: Joi.string().max(64).required(), // 用户的唯一标识符，必填
  password: Joi.alternatives().try(Joi.string().min(8), Joi.allow(null)).optional(), // 密码，可选，支持null
});

module.exports = {
  registerSchema,
  updateUserSchema,
  loginSchema,
};
