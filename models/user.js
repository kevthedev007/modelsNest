"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Recruiter, Models, Document, Social_Media, Event, Media, Payment, Book_Model, Subscription, Store, Store_Images }) {
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
      User.hasMany(Event, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'events'
      })
      User.hasMany(Media, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'media'
      })
      User.hasMany(Payment, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'payment'
      })
      User.hasMany(Book_Model, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'book_model'
      })
      User.hasMany(Subscription, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'subscription'
      })
      User.hasMany(Store, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'store'
      })
      User.hasMany(Store_Images, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'store_images'
      })
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
