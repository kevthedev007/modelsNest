'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recruiter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Recruiter.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user",
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Recruiter.init({
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
    company_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    website: DataTypes.STRING,
    public_id: DataTypes.STRING,
    profile_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recruiter',
  });
  return Recruiter;
};