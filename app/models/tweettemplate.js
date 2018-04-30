'use strict';
module.exports = (sequelize, Sequelize) => {
  var tweetTemplate = sequelize.define('tweetTemplate', {
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
      primaryKey: true,
      unique: "templateKey"
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: "templateKey"
    },
    // Default or specific
    category: {
      type: Sequelize.STRING,
      allowNull: false    
    },
    text: {
    	type: Sequelize.TEXT,
      	allowNull: false  
    }



  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tweetTemplate;
};