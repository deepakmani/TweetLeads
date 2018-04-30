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
    }


  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return sentTweet;
};