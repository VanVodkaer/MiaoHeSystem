const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models");
const logger = require("../utils/logger");
const Joi = require("joi");
const { loginSchema } = require("../schemas/userSchemas");

dotenv.config();

// 微信小程序登录
exports.weixinLogin = async (req, res, next) => {
  try {
    const { code } = req.body;

    // 调用微信接口换取 session_key 和 openid
    const response = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.APPID}&secret=${process.env.SECRET}&js_code=${code}&grant_type=authorization_code`
    );
    const data = await response.json();

    if (response.ok) {
      const { openid } = data;

      // 校验 openid
      const { error } = loginSchema.validate({ openid });
      if (error) {
        logger.error("登录验证失败: %s", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
      }

      // 根据 openid 查找或创建用户
      let user = await User.findOne({ where: { openid } });

      if (!user) {
        // 如果用户不存在，则创建新用户
        user = await User.create({
          openid,
          nickname: openid,
          email: null,
          password: null,
          phone: null,
          permission_level: 0,
        });
      }

      // 生成 JWT 令牌
      const token = jwt.sign(
        { user_id: user.user_id, permission_level: user.permission_level },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      logger.info("微信小程序登录成功: 用户ID %s", user.user_id);
      res.json({ token, user });
    } else {
      logger.error("微信登录失败: %s", data.errmsg);
      return res.status(400).json({ message: data.errmsg });
    }
  } catch (error) {
    logger.error("微信登录时出错: %s", error.message);
    next(error);
  }
};

// 获取所有用户（仅管理员可访问）
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    logger.error("获取所有用户时出错: %s", error.message);
    next(error);
  }
};

// 获取单个用户信息（仅管理员可访问）
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      logger.warn("获取用户失败：用户未找到，用户ID: %s", id);
      return res.status(404).json({ message: "用户未找到" });
    }
    res.json(user);
  } catch (error) {
    logger.error("获取单个用户信息时出错: %s", error.message);
    next(error);
  }
};

// 更新用户信息（受保护）
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nickname, email, phone, password, permission_level } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      logger.warn("更新用户失败：用户未找到，用户ID: %s", id);
      return res.status(404).json({ message: "用户未找到" });
    }

    // 更新字段
    if (nickname) user.nickname = nickname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (permission_level !== undefined) user.permission_level = permission_level;
    if (password) user.password = password;

    await user.save();
    logger.info("用户信息更新成功: 用户ID %s", user.user_id);
    res.json({ message: "用户信息更新成功" });
  } catch (error) {
    logger.error("更新用户信息时出错: %s", error.message);
    next(error);
  }
};

// 删除用户（仅管理员可访问）
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      logger.warn("删除用户失败：用户未找到，用户ID: %s", id);
      return res.status(404).json({ message: "用户未找到" });
    }

    await user.destroy();
    logger.info("删除用户成功: 用户ID %s", id);
    res.status(204).send();
  } catch (error) {
    logger.error("删除用户时出错: %s", error.message);
    next(error);
  }
};
