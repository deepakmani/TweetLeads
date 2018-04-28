'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SearchQueries', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      keyword: {
      type: Sequelize.STRING,
      allowNull: false,
       unique:     'searchQueryIndex',
       primaryKey: true
    },

    // Foreign key
    screen_name: {
      type: Sequelize.STRING,
      allowNull: false,
       unique:     'searchQueryIndex',
       primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'screen_name'
        }
    },
    exclude_keywords: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    exclude_links: {
      type: Sequelize.BOOLEAN
    },
    exclude_media: {
      type: Sequelize.BOOLEAN
    },
    exclude_retweets: {
      type: Sequelize.BOOLEAN
    },
    locations:{
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    // Can be: keyword, profile or followers query
    type: {
      type: Sequelize.STRING
    },
    // defaults to none
    category: {
      type: Sequelize.STRING
    },
    // No, auto_tweet, auto_reply
    enable_auto_tweet: {
      type: Sequelize.STRING
    },
    auto_tweet_template_name: {
      type: Sequelize.STRING 
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SearchQueries');
  }
};