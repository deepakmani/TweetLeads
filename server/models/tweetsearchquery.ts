'use strict';
module.exports = (sequelize, Sequelize) => {
  var TweetSearchQuery = sequelize.define('TweetSearchQuery', {
  	 status_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique:     'tweetSearchQueryIndex',

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
	  //  defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

	}
  // }, {
  //   classMethods: {
  //     associate: function(models) {
  //       // associations can be defined here
  //       TweetSearchQuery.belongsToMany(models.Tweet);
  //       TweetSearchQuery.belongsToMany(models.SearchQuery);

  //     }
  //   }
  });

  
  return TweetSearchQuery;
};