module.exports = (sequelize, DataTypes) => {
  const MembershipCard = sequelize.define(
    "MembershipCard",
    {
      card_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      card_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: "卡状态 (1=有效, 0=无效)",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "创建时间",
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: "更新时间",
      },
    },
    {
      tableName: "membership_cards",
      timestamps: false, // 因为我们手动管理 created_at 和 updated_at
    }
  );

  // 模型关联定义
  MembershipCard.associate = (models) => {
    // 与 User 模型的关系：每张会员卡属于一个用户
    MembershipCard.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE", // 删除用户时，级联删除会员卡
    });

    // 与 MembershipTransaction 模型的关系：每张会员卡有多个交易记录
    MembershipCard.hasMany(models.MembershipTransaction, {
      foreignKey: "card_id",
      as: "transactions",
      onDelete: "CASCADE", // 删除会员卡时，级联删除交易记录
    });
  };

  return MembershipCard;
};
