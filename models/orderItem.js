module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      order_item_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 自增的订单项ID
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.STRING(50), // 订单ID，外键，字符串类型
        allowNull: false,
      },
      product_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 商品ID，外键
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED, // 商品数量
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2), // 单价
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2), // 总价，数量 * 单价
        allowNull: false,
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
      tableName: "order_items", // 表名
      timestamps: false, // 手动管理 created_at 和 updated_at
    }
  );

  // 定义模型关联
  OrderItem.associate = (models) => {
    // 订单项属于一个订单
    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
      onDelete: "CASCADE", // 删除订单时，级联删除订单项
    });

    // 订单项属于一个商品
    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
      onDelete: "CASCADE", // 删除商品时，级联删除订单项
    });
  };

  return OrderItem;
};
