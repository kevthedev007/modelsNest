"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Recruiter, Models, Document, Social_Media }) {
      // define association here
      User.hasOne(Recruiter, {
        foreignKey: { name: "userId", allowNull: false },
        as: "recruiter",
      });
      User.hasOne(Models, {
        foreignKey: { name: "userId", allowNull: false },
        as: "model",
      });
      User.hasOne(Document, {
        foreignKey: { name: "userId", allowNull: false },
        as: "document",
      });
      User.hasOne(Social_Media, {
        foreignKey: { name: "userId", allowNull: false },
        as: "social_media",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
        confirmation_code: undefined,
        verified: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("model", "recruiter"),
        allowNull: false,
      },
      confirmation_code: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
