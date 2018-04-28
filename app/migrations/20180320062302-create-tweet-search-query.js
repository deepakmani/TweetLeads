'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TweetSearchQueries', {
      status_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique:     'tweetSearchQueryIndex',
       onDelete: 'CASCADE',
        references: {
          model: 'Tweets',
          key: 'status_id'
        }

    },
     keyword: {
      type: Sequelize.STRING,
      allowNull: false,
       unique:     'tweetSearchQueryIndex',
       primaryKey: true
    },

    // Foreign key
    screen_name: {
      type: Sequelize.STRING,
      allowNull: false,
       unique:     'tweetSearchQueryIndex',
       primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'screen_name'
        }
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
    return queryInterface.dropTable('TweetSearchQueries');
  }
};