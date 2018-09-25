'use strict';
module.exports = (sequelize, Sequelize) => {
  var TweetAction = sequelize.define('TweetAction', {
      screen_name: {
      type:   Sequelize.STRING,
      primaryKey: true,
      unique: "tweetActionUserIndex"	
    },
    // Can be tweet_reply, tweet, direct message, follow, favorite, read
    actions: {
      type:   Sequelize.ARRAY(Sequelize.STRING),
    },
    status_id: {
     type:   			Sequelize.STRING,
     primaryKey: 		true,		
      unique: "tweetActionUserIndex"
    },
    keyword: {
      type: Sequelize.STRING,
      allowNull: false,
       unique:     'tweetActionUserIndex',
       primaryKey: true
    },
     createdAt: {
	    allowNull: false,
	    type: Sequelize.DATE,
	   defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),


	  },

	  updatedAt: {
	    allowNull: false,
	    type: Sequelize.DATE,
	   // defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

	  }
	},
    {
    	classMethods: {
      		associate: function(models) {
        // associations can be defined here
      		}
    	}
	}
  );
  return TweetAction;
};