const { MembershipCard, User, MembershipTransaction } = require("../models");
const generateUniqueCardNumber = require("../utils/generateCardNumber");
const logger = require("../utils/logger");

// 创建新会员卡
exports.createMembershipCard = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      logger.warn("创建会员卡失败：用户未找到，用户ID: %s", user_id);
      return res.status(404).json({ message: "用户未找到" });
    }

    // 检查用户是否已有会员卡
    const existingCard = await MembershipCard.findOne({ where: { user_id } });
    if (existingCard) {
      logger.warn("创建会员卡失败：用户已拥有会员卡，用户ID: %s", user_id);
      return res.status(400).json({ message: "用户已拥有会员卡" });
    }

    // 生成唯一的卡号
    const card_number = await generateUniqueCardNumber(10);

    // 创建会员卡
    const newCard = await MembershipCard.create({
      user_id,
      card_number,
      balance: 0.0,
      status: 1,
    });

    logger.info("创建会员卡成功: 卡ID %s", newCard.card_id);
    res.status(201).json(newCard);
  } catch (error) {
    logger.error("创建会员卡时出错: %s", error.message);
    next(error);
  }
};

// 获取所有会员卡
exports.getAllMembershipCards = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.permission_level >= 1) {
      // 管理员获取所有会员卡
      const cards = await MembershipCard.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "nickname", "email", "phone"],
          },
        ],
      });
      res.json(cards);
    } else {
      // 普通用户获取自己的会员卡
      const card = await MembershipCard.findOne({
        where: { user_id: user.user_id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "nickname", "email", "phone"],
          },
        ],
      });

      if (!card) {
        return res.status(404).json({ message: "会员卡未找到" });
      }

      res.json([card]);
    }
  } catch (error) {
    logger.error("获取所有会员卡时出错: %s", error.message);
    next(error);
  }
};

// 获取单个会员卡
exports.getMembershipCardById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const card = await MembershipCard.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "nickname", "email", "phone"],
        },
      ],
    });
    if (!card) {
      logger.warn("获取会员卡失败：会员卡未找到，卡ID: %s", id);
      return res.status(404).json({ message: "会员卡未找到" });
    }

    const user = req.user;

    // 检查是否为管理员或卡的所有者
    if (user.permission_level < 1 && card.user_id !== user.user_id) {
      logger.warn("用户ID %s 尝试访问非自己会员卡，卡ID: %s", user.user_id, id);
      return res.status(403).json({ message: "权限不足" });
    }

    res.json(card);
  } catch (error) {
    logger.error("获取单个会员卡时出错: %s", error.message);
    next(error);
  }
};

// 更新会员卡信息
exports.updateMembershipCard = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { balance, status } = req.body;

    const card = await MembershipCard.findByPk(id);
    if (!card) {
      logger.warn("更新会员卡失败：会员卡未找到，卡ID: %s", id);
      return res.status(404).json({ message: "会员卡未找到" });
    }

    // 更新字段
    if (balance !== undefined) card.balance = parseFloat(balance).toFixed(2);
    if (status !== undefined) card.status = status;

    await card.save();
    logger.info("更新会员卡成功: 卡ID %s", card.card_id);
    res.json(card);
  } catch (error) {
    logger.error("更新会员卡时出错: %s", error.message);
    next(error);
  }
};

// 删除会员卡
exports.deleteMembershipCard = async (req, res, next) => {
  const { id } = req.params;
  try {
    const card = await MembershipCard.findByPk(id);
    if (!card) {
      logger.warn("删除会员卡失败：会员卡未找到，卡ID: %s", id);
      return res.status(404).json({ message: "会员卡未找到" });
    }

    await card.destroy();
    logger.info("删除会员卡成功: 卡ID %s", id);
    res.status(204).send();
  } catch (error) {
    logger.error("删除会员卡时出错: %s", error.message);
    next(error);
  }
};

// 创建会员交易记录
exports.createMembershipTransaction = async (req, res, next) => {
  try {
    const { card_id, type, amount, description } = req.body;

    // 验证会员卡是否存在
    const card = await MembershipCard.findByPk(card_id);
    if (!card) {
      logger.warn("创建会员交易失败：会员卡未找到，卡ID: %s", card_id);
      return res.status(404).json({ message: "会员卡未找到" });
    }

    let balanceAfter;
    switch (type) {
      case 1: // 充值
        balanceAfter = parseFloat(card.balance) + parseFloat(amount);
        break;
      case 2: // 消费
        balanceAfter = parseFloat(card.balance) - parseFloat(amount);
        if (balanceAfter < 0) {
          logger.warn("创建会员交易失败：余额不足，卡ID: %s", card_id);
          return res.status(400).json({ message: "余额不足" });
        }
        break;
      case 3: // 退款
        balanceAfter = parseFloat(card.balance) + parseFloat(amount);
        break;
      default:
        logger.warn("创建会员交易失败：无效的交易类型，类型: %s", type);
        return res.status(400).json({ message: "无效的交易类型" });
    }

    // 更新会员卡余额
    card.balance = balanceAfter.toFixed(2);
    await card.save();

    // 创建交易记录
    const transaction = await MembershipTransaction.create({
      card_id,
      type,
      amount: parseFloat(amount).toFixed(2),
      balance_after: balanceAfter.toFixed(2),
      description,
    });

    logger.info("创建会员交易成功: 交易ID %s", transaction.transaction_id);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error("创建会员交易时出错: %s", error.message);
    next(error);
  }
};
