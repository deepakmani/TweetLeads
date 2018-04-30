'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tweetTemplates', {
      createdAt: {
         allowNull: false,
         type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    // Foreign key
    screen_name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: "templateKey",
       onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'screen_name'
        }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: "templateKey"
    },
    // Default or specific
    category: {
      type: Sequelize.STRING,
      allowNull: false    
    },
    text: {
      type: Sequelize.TEXT,
        allowNull: false  
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tweetTemplates');
  }
};