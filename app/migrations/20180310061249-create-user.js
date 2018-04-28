'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
       screen_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profile_img_url: {
      type:      Sequelize.STRING,
      allowNull: false
    },
    access_token_key: {
      type:      Sequelize.STRING
    },
    access_token_secret: {
      type:      Sequelize.STRING
    },
    plan: {
      type:     Sequelize.STRING
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};