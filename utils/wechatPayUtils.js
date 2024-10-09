// utils/wechatPayUtils.js

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const https = require("https");
const logger = require("./logger");

// 从环境变量中获取微信支付相关配置
const { WECHAT_MCHID, WECHAT_API_PRIVATE_KEY_PATH, WECHAT_API_CERT_SERIAL_NO, WECHAT_API_V3_KEY, WECHAT_APPID } =
  process.env;

// 读取商户私钥
const privateKey = fs.readFileSync(path.resolve(WECHAT_API_PRIVATE_KEY_PATH), "utf8");

// 生成请求签名
function generateSignature(method, url, timestamp, nonceStr, body = "") {
  const message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(message);
  return sign.sign(privateKey, "base64");
}

// 创建微信支付请求实例
const wechatPayInstance = axios.create({
  baseURL: "https://api.mch.weixin.qq.com",
  timeout: 10000,
  httpsAgent: new https.Agent({
    keepAlive: true,
    cert: fs.readFileSync(path.resolve(process.env.WECHAT_API_CLIENT_CERT_PATH)), // 商户证书
    key: fs.readFileSync(path.resolve(process.env.WECHAT_API_CLIENT_KEY_PATH)), // 商户私钥
  }),
});

// 请求拦截器：为每个请求添加认证信息
wechatPayInstance.interceptors.request.use(
  (config) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = crypto.randomBytes(16).toString("hex");
    const method = config.method.toUpperCase();
    const url = new URL(config.url, "https://api.mch.weixin.qq.com").pathname;
    const body = config.data ? JSON.stringify(config.data) : "";

    // 生成签名
    const signature = generateSignature(method, url, timestamp, nonceStr, body);

    // 添加认证头信息
    config.headers = {
      ...config.headers,
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${WECHAT_MCHID}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${WECHAT_API_CERT_SERIAL_NO}"`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 缓存微信支付平台证书
let platformCertificates = {};

// 获取微信支付平台证书
async function getPlatformCertificates() {
  try {
    const response = await wechatPayInstance.get("/v3/certificates");
    if (response.status === 200) {
      const certs = response.data.data;
      for (const certInfo of certs) {
        const serialNo = certInfo.serial_no;
        const encryptCert = certInfo.encrypt_certificate;
        // 解密平台证书
        const decodedCert = decryptCertificate(encryptCert);
        platformCertificates[serialNo] = decodedCert;
      }
      logger.info("成功获取并缓存微信支付平台证书");
    } else {
      logger.error("获取微信支付平台证书失败：%s", response.status);
    }
  } catch (error) {
    logger.error("获取微信支付平台证书时出错：%s", error.message);
  }
}

// 解密平台证书
function decryptCertificate(encryptCert) {
  const { associated_data, nonce, ciphertext } = encryptCert;
  const cipherBuffer = Buffer.from(ciphertext, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", WECHAT_API_V3_KEY, nonce);
  decipher.setAuthTag(cipherBuffer.slice(cipherBuffer.length - 16));
  decipher.setAAD(Buffer.from(associated_data, "utf8"));

  let decoded = decipher.update(cipherBuffer.slice(0, cipherBuffer.length - 16), null, "utf8");
  decoded += decipher.final("utf8");
  return decoded;
}

// 获取平台公钥
async function getPlatformPublicKey(serial) {
  // 如果缓存中有该序列号的证书，则返回
  if (platformCertificates[serial]) {
    return platformCertificates[serial];
  }

  // 重新获取证书
  await getPlatformCertificates();
  return platformCertificates[serial] || null;
}

// 应用启动时获取平台证书
getPlatformCertificates();

// 定期更新平台证书（每12小时更新一次）
setInterval(getPlatformCertificates, 12 * 60 * 60 * 1000);

module.exports = {
  wechatPayInstance,
  getPlatformPublicKey,
  privateKey,
  WECHAT_APPID,
};
