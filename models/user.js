const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // 方法用于验证密码
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 自增的用户ID
        autoIncrement: true,
        primaryKey: true,
      },
      openid: {
        type: DataTypes.STRING(64), // 用户唯一标识符
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(50), // 用户昵称
        allowNull: false,
      },
      avatar_url: {
        type: DataTypes.STRING(255), // 用户头像URL
        allowNull: true,
      },
      gender: {
        type: DataTypes.TINYINT, // 性别
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20), // 电话号码
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100), // 邮箱地址
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true, // 验证邮箱格式
        },
      },
      password: {
        type: DataTypes.STRING(255), // 加密后的密码
        allowNull: true,
      },
      permission_level: {
        type: DataTypes.TINYINT, // 权限等级
        allowNull: false,
        defaultValue: 0,
        comment: "权限等级 (0=普通用户, 1=管理员)",
      },
      created_at: {
        type: DataTypes.DATE, // 创建时间
        defaultValue: DataTypes.NOW,
        comment: "创建时间",
      },
      updated_at: {
        type: DataTypes.DATE, // 更新时间
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: "更新时间",
      },
    },
    {
      sequelize,
      modelName: "User", // 模型名称
      tableName: "users", // 数据库表名称
      timestamps: false, // 手动管理时间戳
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10); // 生成盐
            user.password = await bcrypt.hash(user.password, salt); // 哈希密码
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10); // 生成盐
            user.password = await bcrypt.hash(user.password, salt); // 哈希密码
          }
        },
      },
    }
  );

  // 定义模型关联
  User.associate = (models) => {
    // 用户拥有一张会员卡
    User.hasOne(models.MembershipCard, {
      foreignKey: "user_id",
      as: "membershipCard",
      onDelete: "CASCADE", // 用户删除时，级联删除其会员卡
    });

    // 用户可以有多个订单
    User.hasMany(models.Order, {
      foreignKey: "user_id",
      as: "orders",
      onDelete: "CASCADE", // 用户删除时，级联删除其订单
    });
  };

  return User;
};
