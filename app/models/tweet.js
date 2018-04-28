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
      type:   Sequelize.STRING
    },
    in_reply_to_status_id:{
      type:   Sequelize.STRING
    },
    // link_click, profile visit, favorite
    engagements: {
      type:  Sequelize.ARRAY(Sequelize.STRING)
    },
     createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
     defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),


    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
//      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

    }
  },{

    classMethods: {
      associate: function(models) {
        Tweet.belongsToMany(models.SearchQuery, {
         through: models.TweetSearchQuery,
         foreignKey: 'status_id'
       });
        Tweet.belongsToMany(models.User, {
         through: models.TweetAction
       });
      }
    }
  });
  return Tweet;
};