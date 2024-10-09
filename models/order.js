const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    // 定义模型关联
    static associate(models) {
      // 订单属于一个用户
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE", // 删除用户时，级联删除其相关订单
      });

      // 订单有多个订单项
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "orderItems",
        onDelete: "CASCADE", // 删除订单时，级联删除其相关订单项
      });
    }
  }

  // 初始化订单模型字段
  Order.init(
    {
      order_id: {
        type: DataTypes.STRING(50), // 订单ID，字符串类型
        primaryKey: true,
        allowNull: false,
        comment: "订单ID，由用户ID和时间戳组成",
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 用户ID，外键
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2), // 总金额
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT, // 订单状态
        allowNull: false,
        defaultValue: 0,
        comment: "订单状态 (0=待支付,1=已支付,2=已发货,3=已完成,4=已取消)",
      },
      payment_method: {
        type: DataTypes.STRING(50), // 支付方式
        allowNull: true,
      },
      payment_id: {
        type: DataTypes.STRING(100), // 支付ID
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE, // 订单创建时间
        defaultValue: DataTypes.NOW,
        comment: "创建时间",
      },
      updated_at: {
        type: DataTypes.DATE, // 订单更新时间
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: "更新时间",
      },
    },
    {
      sequelize,
      modelName: "Order", // 模型名称
      tableName: "orders", // 数据库表名称
      timestamps: false, // 手动管理 created_at 和 updated_at
    }
  );

  return Order;
};
