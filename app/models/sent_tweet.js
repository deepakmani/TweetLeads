'use strict';
module.exports = (sequelize, DataTypes) => {
  var sent_tweet = sequelize.define('sent_tweet', {}, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return sent_tweet;
};