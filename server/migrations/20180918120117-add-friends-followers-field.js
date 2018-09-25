'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */   var sequelize = queryInterface.sequelize;

     return sequelize.transaction(function (t) {
          return queryInterface.addColumn('Tweets', "followers_friends_bucket", Sequelize.INTEGER, {transaction: t})
          // .then(function() {
          //     return queryInterface.removeColumn('Tweets', "following_followers_bucket", {transaction: t})
          // })
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
          return queryInterface.removeColumn('Tweets', "followers_friends_bucket", Sequelize.STRING, {transaction: t})
          // .then(function() {
          //     return queryInterface.addColumn('Tweets', "following_followers_bucket", Sequelize.INTEGER, {transaction: t})
          // })
     });    
  }
};
