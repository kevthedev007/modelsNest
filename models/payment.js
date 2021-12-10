'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Book_Model }) {
      // define association here
      Payment.belongsTo(User, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'user', onDelete: 'CASCADE'
      })
    }

    toJSON() {
      return { ...this.get(), userId: undefined, updatedAt: undefined }
    }
  };
  Payment.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    amount: DataTypes.INTEGER,
    purpose: DataTypes.STRING,
    reference: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};