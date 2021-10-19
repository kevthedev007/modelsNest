'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      age: {
        type: Sequelize.INTEGER
      },
      complexion: {
        type: Sequelize.STRING
      },
      body_size: {
        type: Sequelize.INTEGER
      },
      bust: {
        type: Sequelize.INTEGER
      },
      waist: {
        type: Sequelize.INTEGER
      },
      hips: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM("fashion model", "runway", "ushering", "commercial", "video vixen", "face model")
      },
      country: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false
      },
      documentId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Models');
  }
};