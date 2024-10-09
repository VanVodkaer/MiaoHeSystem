const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

console.log(`当前环境: ${env}`);
console.log("配置内容:", config); // 用于调试配置内容

if (!config) {
  throw new Error(`未找到环境 ${env} 的配置`);
}

// 创建 Sequelize 实例
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// 读取模型文件并加载模型
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.slice(-3) === ".js") // 排除 index.js 文件
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); // 导入模型
    db[model.name] = model; // 将模型存入 db 对象
  });

// 处理模型之间的关联
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // 调用关联方法
  }
});

// 将 sequelize 实例和 Sequelize 构造函数挂载到 db 对象上
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
