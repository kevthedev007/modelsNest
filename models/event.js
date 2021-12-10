'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      Event.belongsTo(User, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'user', onDelete: 'CASCADE'
      })
    }

    toJSON() {
      return { ...this.get(), userId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  Event.init({
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
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    category: DataTypes.STRING,
    about: DataTypes.STRING,
    public_id: DataTypes.STRING,
    image: DataTypes.STRING,
    fee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};