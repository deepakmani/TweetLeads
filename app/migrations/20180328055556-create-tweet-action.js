'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TweetActions', {
        screen_name: {
        type:   Sequelize.STRING,
        primaryKey: true,
        unique: "tweetActionUserIndex"  
      },
      // Can be tweet_reply, tweet, direct message, follow, favorite, response, read
      type: {
        type:   Sequelize.ARRAY(Sequelize.STRING)
      },
      status_id: {
       type:        Sequelize.STRING,
       primaryKey:    true,   
        unique: "tweetActionUserIndex"
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
    return queryInterface.dropTable('TweetActions');
  }
};