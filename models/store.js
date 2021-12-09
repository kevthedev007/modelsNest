'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Store_Images }) {
      // define association here
      Store.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
      });
      Store.hasMany(Store_Images, {
        foreignKey: { name: 'storeId', allowNull: false },
        as: 'store_images'
      })
    }
    
    toJSON() {
      return { ...this.get(), userId: undefined, public_id: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Store.init({
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
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    price: DataTypes.STRING,
    image: DataTypes.STRING,
    public_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};