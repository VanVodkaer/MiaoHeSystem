module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    "ProductCategory",
    {
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 自增的类别ID
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100), // 类别名称，必须唯一
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT, // 类别描述
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 父类别ID，可用于层级结构
        allowNull: true,
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
      tableName: "product_categories", // 表名
      timestamps: false, // 手动管理 created_at 和 updated_at
    }
  );

  // 定义模型关联
  ProductCategory.associate = (models) => {
    // 类别与其子类别的层级关联
    ProductCategory.hasMany(models.ProductCategory, {
      foreignKey: "parent_id",
      as: "subCategories",
      onDelete: "SET NULL", // 删除父类别时，子类别的父ID设置为NULL
    });

    // 类别与产品的关联，一个类别包含多个产品
    ProductCategory.hasMany(models.Product, {
      foreignKey: "category_id",
      as: "products",
      onDelete: "CASCADE", // 删除类别时，级联删除其产品
    });
  };

  return ProductCategory;
};
