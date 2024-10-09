const { Order, User } = require("../models");
const logger = require("../utils/logger");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { wechatPayInstance, getPlatformPublicKey, privateKey, WECHAT_APPID } = require("../utils/wechatPayUtils");

dotenv.config();

exports.createWxPayOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const user_id = req.user.user_id;

    // 查找订单
    const order = await Order.findOne({ where: { order_id, user_id } });
    if (!order) {
      logger.warn("支付请求失败：订单未找到，订单ID：%s，用户ID：%s", order_id, user_id);
      return res.status(404).json({ message: "订单未找到" });
    }

    if (order.status !== 0) {
      logger.warn("支付请求失败：订单状态不正确，订单ID：%s，状态：%s", order_id, order.status);
      return res.status(400).json({ message: "订单状态不正确" });
    }

    // 获取用户的 openid
    const user = await User.findByPk(user_id);
    if (!user || !user.openid) {
      logger.warn("支付请求失败：用户 OpenID 未找到，用户 ID：%s", user_id);
      return res.status(400).json({ message: "用户 OpenID 未找到" });
    }
    const openid = user.openid;

    // 准备请求数据
    const appid = WECHAT_APPID;
    const notify_url = process.env.WECHAT_PAY_NOTIFY_URL;
    const description = "订单支付";
    const out_trade_no = order_id;
    const total = Math.round(order.total_amount * 100); // 金额，单位为分

    const requestData = {
      appid,
      mchid: process.env.WECHAT_MCHID,
      description,
      out_trade_no,
      notify_url,
      amount: {
        total,
        currency: "CNY",
      },
      payer: {
        openid,
      },
    };

    // 调用微信支付下单接口
    const response = await wechatPayInstance.post("/v3/pay/transactions/jsapi", requestData);

    if (response.status === 200 || response.status === 201) {
      const prepay_id = response.data.prepay_id;

      // 生成支付参数
      const timeStamp = Math.floor(Date.now() / 1000).toString();
      const nonceStr = crypto.randomBytes(16).toString("hex");
      const packageStr = `prepay_id=${prepay_id}`;
      const paySignData = {
        appId: appid,
        timeStamp,
        nonceStr,
        package: packageStr,
        signType: "RSA",
      };

      const message = `${paySignData.appId}\n${paySignData.timeStamp}\n${paySignData.nonceStr}\n${paySignData.package}\n`;
      const sign = crypto.createSign("RSA-SHA256");
      sign.update(message);
      const paySign = sign.sign(privateKey, "base64");

      res.json({
        timeStamp,
        nonceStr,
        package: packageStr,
        signType: "RSA",
        paySign,
      });
    } else {
      logger.error("微信下单失败：%s", response.data);
      return res.status(500).json({ message: "微信下单失败", details: response.data });
    }
  } catch (error) {
    logger.error("创建微信支付订单时出错：%s", error.message);
    next(error);
  }
};

// 处理微信支付通知
exports.wxPayNotify = async (req, res, next) => {
  try {
    // 微信支付通知的请求头中包含 Wechatpay-Signature 等信息
    const signature = req.headers["wechatpay-signature"];
    const timestamp = req.headers["wechatpay-timestamp"];
    const nonce = req.headers["wechatpay-nonce"];
    const serial = req.headers["wechatpay-serial"];
    const body = req.body; // 原始的 JSON 数据

    // 验证签名
    const publicKey = await getPlatformPublicKey(serial);
    if (!publicKey) {
      logger.error("无法找到对应的微信支付平台公钥，序列号：%s", serial);
      return res.status(400).send();
    }

    const verify = crypto.createVerify("RSA-SHA256");
    const signMessage = `${timestamp}\n${nonce}\n${JSON.stringify(body)}\n`;
    verify.update(signMessage);
    const isVerified = verify.verify(publicKey, signature, "base64");

    if (!isVerified) {
      logger.warn("微信支付回调签名验证失败");
      return res.status(401).send();
    }

    // 解密报文
    const { resource } = body;
    const WECHAT_API_V3_KEY = process.env.WECHAT_API_V3_KEY;

    const cipherText = resource.ciphertext;
    const associatedData = resource.associated_data;
    const nonce_str = resource.nonce;

    // 解密
    const cipherBuffer = Buffer.from(cipherText, "base64");
    const authTag = cipherBuffer.slice(cipherBuffer.length - 16);
    const dataToDecrypt = cipherBuffer.slice(0, cipherBuffer.length - 16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(WECHAT_API_V3_KEY, "utf-8"), nonce_str);
    decipher.setAuthTag(authTag);
    if (associatedData) {
      decipher.setAAD(Buffer.from(associatedData, "utf-8"));
    }

    let decrypted = decipher.update(dataToDecrypt, null, "utf8");
    decrypted += decipher.final("utf8");

    const result = JSON.parse(decrypted);

    // 处理订单
    const out_trade_no = result.out_trade_no;
    const transaction_id = result.transaction_id;
    const total_fee = result.amount.total;

    const order = await Order.findOne({
      where: { order_id: out_trade_no },
    });
    if (!order) {
      logger.warn("微信支付回调失败：订单未找到，订单 ID：%s", out_trade_no);
      return res.status(404).send();
    }

    const totalAmount = Math.round(order.total_amount * 100);
    if (total_fee !== totalAmount) {
      logger.warn(
        "微信支付回调失败：金额不匹配，订单 ID：%s，订单金额：%s，支付金额：%s",
        out_trade_no,
        totalAmount,
        total_fee
      );
      return res.status(400).send();
    }

    // 更新订单状态
    order.status = 1; // 已支付
    order.payment_method = "微信支付";
    order.payment_id = transaction_id;
    await order.save();

    logger.info("微信支付回调成功：订单 ID %s 已更新为已支付", out_trade_no);

    res.status(200).send({ code: "SUCCESS", message: "成功" });
  } catch (error) {
    logger.error("处理微信支付回调时出错：%s", error.message);
    res.status(500).send({ code: "FAIL", message: "服务器内部错误" });
  }
};
