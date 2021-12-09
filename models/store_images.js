'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store_Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Store, User }) {
      // define association here
      Store_Images.belongsTo(Store, {
        foreignKey: { name: "storeId", allowNull: false },
        as: "store", onDelete: 'CASCADE'
      });
      Store_Images.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user", onDelete: 'CASCADE'
      });
    }
  };
  Store_Images.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.UUID,
      references: {
        model: 'Stores',
        key: 'id'
      }
    },
    image: DataTypes.STRING,
    public_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store_Images',
  });
  return Store_Images;
};