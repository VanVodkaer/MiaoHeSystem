module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 自增的产品ID
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 类别ID，外键
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(150), // 产品名称
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // 产品描述
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // 产品价格
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER.UNSIGNED, // 库存数量
        allowNull: false,
        defaultValue: 0,
      },
      image_url: {
        type: DataTypes.STRING(255), // 产品图片URL
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT, // 产品状态 (1=激活, 0=禁用)
        allowNull: false,
        defaultValue: 1,
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
      tableName: "products", // 表名
      timestamps: false, // 手动管理 created_at 和 updated_at
    }
  );

  // 定义模型关联
  Product.associate = (models) => {
    // 产品属于一个类别
    Product.belongsTo(models.ProductCategory, {
      foreignKey: "category_id",
      as: "category",
      onDelete: "CASCADE", // 删除类别时级联删除相关产品
    });

    // 产品有多个订单项
    Product.hasMany(models.OrderItem, {
      foreignKey: "product_id",
      as: "orderItems",
      onDelete: "CASCADE", // 删除产品时级联删除订单项
    });
  };

  return Product;
};
