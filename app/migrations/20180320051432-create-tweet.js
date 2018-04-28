'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tweets', {
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
      primaryKey: true,
      allowNull: false
    },
    created_at:
    {
      type: Sequelize.DATE
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profile_img_url: {
      type: Sequelize.STRING
    },
    text: {
      type:   Sequelize.STRING
    },
    // Can be search, outreach, reply
    type: {
      type:   Sequelize.STRING
    },
    in_reply_to_status_id:{
      type:   Sequelize.STRING
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    link_click: {
      type: Sequelize.BOOLEAN
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tweets');
  }
};