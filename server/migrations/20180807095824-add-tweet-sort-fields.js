'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    var sequelize = queryInterface.sequelize;
 
     return sequelize.transaction(function (t) {
          return queryInterface.addColumn('Tweets', 'followers', Sequelize.STRING, {transaction: t})
          .then(function() {
              return queryInterface.addColumn('Tweets', "following", Sequelize.STRING, {transaction: t})
            })
          .then(function() {
            return queryInterface.addColumn('Tweets', "description", Sequelize.TEXT, {transaction: t})

          })
          .then(function() {
              return queryInterface.addColumn('Tweets', "profile_url", Sequelize.STRING, {transaction: t})
          })
          .then(function() {
            return queryInterface.addColumn('Tweets', "source", Sequelize.STRING, {transaction: t})
          })  
          .then(function() {
            return queryInterface.addColumn('Tweets', "following_followers_bucket", Sequelize.INTEGER, {transaction: t})
          })  
          .then(function() {
            return queryInterface.addColumn('Tweets', "has_link", Sequelize.BOOLEAN, {transaction: t})
          })  
          .then(function() {
            return queryInterface.addColumn('Tweets', "is_retweet", Sequelize.BOOLEAN, {transaction: t})
          })  
          .then(function() {
            return queryInterface.addColumn('Tweets', "is_known_source", Sequelize.BOOLEAN, {transaction: t})
          }) 
          .then(function() {
            return queryInterface.addColumn('Tweets', "has_description", Sequelize.BOOLEAN, {transaction: t})
          })  
          .then(function() {
            return queryInterface.addColumn('Tweets', "has_profile_url", Sequelize.BOOLEAN, {transaction: t})
          })   
           .then(function() {
            return queryInterface.addColumn('Tweets', "created_at", Sequelize.DATE, {transaction: t})
          })                        
    
   
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
       return sequelize.transaction(function (t) {
          return queryInterface.removeColumn('Tweets', 'followers',  {transaction: t})
          .then(function() {
              return queryInterface.removeColumn('Tweets', "following", {transaction: t})
            })
          .then(function() {
            return queryInterface.removeColumn('Tweets', "description", {transaction: t})

          })
          .then(function() {
              return queryInterface.removeColumn('Tweets', "profile_url", {transaction: t})
          })
          .then(function() {
            return queryInterface.removeColumn('Tweets', "source", {transaction: t})
          }) 
          .then(function() {
            return queryInterface.removeColumn('Tweets', "following_followers_bucket", {transaction: t})
          })  
          .then(function() {
            return queryInterface.removeColumn('Tweets', "has_link", {transaction: t})
          })  
          .then(function() {
            return queryInterface.removeColumn('Tweets', "is_retweet", {transaction: t})
          })  
          .then(function() {
            return queryInterface.removeColumn('Tweets', "is_known_source", {transaction: t})
          }) 
          .then(function() {
            return queryInterface.removeColumn('Tweets', "has_description", {transaction: t})
          })  
          .then(function() {
            return queryInterface.removeColumn('Tweets', "has_profile_url", {transaction: t})
          })  
           .then(function() {
            return queryInterface.removeColumn('Tweets', "created_at", {transaction: t})
          })                        
    
   
      });
  }
};
