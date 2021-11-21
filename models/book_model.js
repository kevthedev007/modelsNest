'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book_Model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Payment, User }) {
      // define association here
      Book_Model.belongsTo(User, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'user'
      })
    }
  };
  Book_Model.init({
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
    description: DataTypes.STRING,
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    payment_reference: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Book_Model',
  });
  return Book_Model;
};