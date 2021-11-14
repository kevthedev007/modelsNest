'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Social_Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Social_Media.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Social_Media.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
    },
    twitter: DataTypes.STRING,
    instagram: DataTypes.STRING,
    facebook: DataTypes.STRING,
    tiktok: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Social_Media',
  });
  return Social_Media;
};