'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Media.belongsTo(User, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'user'
      })
    }

    toJSON() {
      return { ...this.get(), userId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Media.init({
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
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Media',
  });
  return Media;
};