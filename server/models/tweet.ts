'use strict';
module.exports = (sequelize, Sequelize) => {
  var Tweet = sequelize.define('Tweet',  {
    // Foreign key
    screen_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location: {
      type: Sequelize.STRING,
     },
    profile_img_url: {
      type: Sequelize.STRING
    },
    text: {
      type:   Sequelize.TEXT
    },
    in_reply_to_status_id:{
      type:   Sequelize.STRING
    },
    created_at: {
      type: Sequelize.DATE,
    },
     createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
     defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),


    },
  
    followers_count: {
      type:  Sequelize.INTEGER,
    },
    friends_count: {
      type:  Sequelize.INTEGER,
    },
    profile_description: {
      type: Sequelize.TEXT
    },
    profile_url: {
      type: Sequelize.STRING
    },

      // ASC sort
    source: {
      type: Sequelize.STRING
    },
    // ASC sort
    is_retweet: {
      type: Sequelize.BOOLEAN
    },
    // ASC sort
    is_reply: {
      type: Sequelize.BOOLEAN
    },
    tweet_score: {
      type: Sequelize.INTEGER
    },
    // 1, 2, 3, 4 based on ratio rounded to quartile
    
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
//      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

    },
    retweeted_status_id: {
      type:   Sequelize.STRING
    }
  },{

    classMethods: {
      associate: function(models) {
        Tweet.belongsToMany(models.SearchQuery, {
         through:     models.TweetSearchQuery,
         foreignKey: 'status_id'
       });
        // Tweets are shared by users
        // Tweet actions are specific to each user
        Tweet.belongsToMany(models.User, {
         through: models.TweetAction
       });
      }
    }
  });
  return Tweet;
};