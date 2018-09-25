'use strict';
module.exports = (sequelize, Sequelize) => {
  var sentTweet = sequelize.define('sentTweet', {
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
    },
     keyword: {
      type: Sequelize.STRING,
      allowNull: false,
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
    },
    
   
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        sentTweet.belongsTo(models.User, { 
    		foreignKey: 'screen_name',
		 	onDelete: 'CASCADE'
   		});

   		sentTweet.belongsTo(models.SearchQuery, { 
    		foreignKey: 'keyword', scope: { screen_name: { $col: 'SearchQuery.screen_name' }}
   		});

   	// 	// 0-1 relationship
   	// 	sentTweet.belongsTo(models.tweetTemplate, { 
    // 		foreignKey: 'template_name',
		 	// onDelete: 'CASCADE'
   	// 	});
      }
    }
  });
  return sentTweet;
};