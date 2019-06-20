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
        return queryInterface.addColumn('SearchQueries', "auto_follow", Sequelize.BOOLEAN, {transaction: t})
            .then(function() {
                return queryInterface.removeColumn('Tweets', "followers_friends_count", {transaction: t})
            })
            .then(function() {
                return queryInterface.addColumn('SearchQueries', "search_potential_need_keywords", Sequelize.BOOLEAN,  {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "actions",   {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "keyword",   {transaction: t})
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
  }
};
