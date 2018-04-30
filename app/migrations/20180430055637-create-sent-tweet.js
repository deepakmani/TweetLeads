'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sentTweets', {
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
      onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'screen_name'
        }
    },
    status_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    // Can be null, if its a tweet not a reply
    in_reply_to_status_id: {
      type: Sequelize.STRING,
    },

    // cannot be null
    to_screen_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Can be null
    template_name: {
       type: Sequelize.STRING
    },
    // Can be null, if user doesnt click
    link_click: {
      type: Sequelize.BOOLEAN
    },
    // Can be null if no reply
    replied: {
      type: Sequelize.BOOLEAN
    }

    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sentTweets');
  }
};