"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Document.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  }
  Document.init(
    {
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
      public_id: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Document",
    }
  );
  return Document;
};
