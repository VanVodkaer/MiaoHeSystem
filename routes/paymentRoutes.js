const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticateToken = require("../middleware/auth");

// 发起微信支付（需要认证）
router.post("/wxpay", authenticateToken, paymentController.createWxPayOrder);

// 微信支付结果通知回调
router.post("/wxpay/notify", paymentController.wxPayNotify);

module.exports = router;
