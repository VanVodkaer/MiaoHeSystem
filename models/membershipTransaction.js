module.exports = (sequelize, DataTypes) => {
  const MembershipTransaction = sequelize.define(
    "MembershipTransaction",
    {
      transaction_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      card_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "交易类型 (1=充值, 2=消费, 3=退款)",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      balance_after: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      tableName: "membership_transactions",
      timestamps: false, // 我们手动管理 created_at 和 updated_at
    }
  );

  // 关联定义：每个交易记录属于一张会员卡
  MembershipTransaction.associate = (models) => {
    MembershipTransaction.belongsTo(models.MembershipCard, {
      foreignKey: "card_id",
      as: "membershipCard",
      onDelete: "CASCADE", // 删除会员卡时级联删除相关交易记录
    });
  };

  return MembershipTransaction;
};
