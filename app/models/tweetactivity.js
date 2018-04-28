'use strict';
module.exports = (sequelize, Sequelize) => {
  var TweetActivity = sequelize.define('TweetActivity',  {
    screen_name: {
      type:   Sequelize.STRING,
      primaryKey: true,
      unique: "tweetActionUserIndex"	
    },
    // Can be tweet_reply, tweet, direct message, follow, favorite, response, read
    type: {
      type:   Sequelize.STRING,

    },
    status_id: {
     type:   			Sequelize.STRING,
     primaryKey: 		true,		
      unique: "tweetActionUserIndex"
    }
    }, 
    {classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TweetActivity;
};