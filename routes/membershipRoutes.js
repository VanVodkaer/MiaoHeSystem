const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");
const authorize = require("../middleware/authorize");

// 创建会员卡 - 仅管理员可访问
router.post("/cards", authorize(1), membershipController.createMembershipCard);

// 获取所有会员卡 - 管理员获取所有，普通用户获取自己的
router.get("/cards", authorize(0), membershipController.getAllMembershipCards);

// 获取单个会员卡 - 管理员获取任何，普通用户获取自己的
router.get("/cards/:id", authorize(0), membershipController.getMembershipCardById);

// 更新会员卡信息 - 仅管理员可访问
router.put("/cards/:id", authorize(1), membershipController.updateMembershipCard);

// 删除会员卡 - 仅管理员可访问
router.delete("/cards/:id", authorize(1), membershipController.deleteMembershipCard);

// 创建会员交易记录 - 仅管理员可访问
router.post("/transactions", authorize(1), membershipController.createMembershipTransaction);

module.exports = router;
