'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Models extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Models.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user", onDelete: 'CASCADE'
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Models.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    age: DataTypes.INTEGER,
    complexion: DataTypes.STRING,
    body_size: DataTypes.INTEGER,
    bust: DataTypes.INTEGER,
    waist: DataTypes.INTEGER,
    hips: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    category: DataTypes.ENUM("fashion model", "runway", "ushering", "commercial", "video vixen", "face model"),
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    public_id: DataTypes.STRING,
    profile_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Models',
  });
  return Models;
};