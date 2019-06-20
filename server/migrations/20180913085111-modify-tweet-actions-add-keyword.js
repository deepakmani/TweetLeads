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
          return queryInterface.removeColumn('TweetActions', 'type',  {transaction: t})
          .then(function() {
              return queryInterface.addColumn('Tweet', "actions",  Sequelize.ARRAY(Sequelize.STRING), {transaction: t})
          })
          .then(function() {
              return queryInterface.addColumn('Tweets', "keyword",  Sequelize.STRING, {transaction: t})
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
      return queryInterface.addColumn('TweetActions', 'action',  Sequelize.STRING, {transaction: t})
          .then(function() {
              return queryInterface.removeColumn('Tweets', "actions", {transaction: t})
          })
          .then(function() {
              return queryInterface.removeColumn('Tweets', "keyword",  {transaction: t})
          })
  }
};
