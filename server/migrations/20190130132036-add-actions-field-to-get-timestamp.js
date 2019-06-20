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
          return queryInterface.addColumn('TweetActions', "action", Sequelize.STRING, {transaction: t})
          .then(function() {
              return queryInterface.removeColumn('TweetActions', "contacted_or_replied", {transaction: t})
          })
          .then(function() {
             return queryInterface.removeColumn('TweetActions', "follower_or_friend",  {transaction: t})
          }) 
          .then(function() {
             return queryInterface.removeColumn('TweetActions', "read",  {transaction: t})
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
     var sequelize = queryInterface.sequelize;

     return sequelize.transaction(function (t) {
          return queryInterface.removeColumn('TweetActions', "action", {transaction: t})
          .then(function() {
              return queryInterface.addColumn('TweetActions', "contacted_or_replied", Sequelize.BOOLEAN, {transaction: t})
          })
          .then(function() {
             return queryInterface.addColumn('TweetActions', "follower_or_friend", Sequelize.BOOLEAN, {transaction: t})
          }) 
          .then(function() {
             return queryInterface.addColumn('TweetActions', "read",  Sequelize.BOOLEAN, {transaction: t})
          }) 
      });    
  }
};
