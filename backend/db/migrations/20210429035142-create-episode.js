'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Episodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      podcastId: {
        allowNull: false,
        references: {
          model: 'Podcasts'
        },
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      description: {
        type: Sequelize.TEXT
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      releaseDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      guid: {
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
    await queryInterface.dropTable('Episodes');
  }
};