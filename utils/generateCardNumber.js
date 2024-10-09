// utils/generateCardNumber.js

const { MembershipCard } = require("../models");

// 生成指定长度的随机数字字符串
const generateRandomNumber = (length) => {
  let number = "";
  for (let i = 0; i < length; i++) {
    number += Math.floor(Math.random() * 10).toString(); // 随机生成0-9的数字
  }
  return number;
};

// 生成唯一的纯数字卡号
const generateUniqueCardNumber = async (length = 10) => {
  let cardNumber;
  let exists = true;

  // 循环生成直到找到唯一的卡号
  while (exists) {
    cardNumber = generateRandomNumber(length); // 生成随机卡号
    const card = await MembershipCard.findOne({ where: { card_number: cardNumber } }); // 数据库查询
    if (!card) {
      exists = false; // 如果卡号不存在，退出循环
    }
  }

  return cardNumber;
};

module.exports = generateUniqueCardNumber;
