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
        return queryInterface.addColumn('Tweets', "tweet_score", Sequelize.INTEGER, {transaction: t})
            .then(function() {
                return queryInterface.removeColumn('Tweets', "potential_need_score", {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "has_description", {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "has_profile_url", {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "is_known_source", {transaction: t})
            })
             .then(function() {
                return queryInterface.removeColumn('Tweets', "followers_friends_bucket", {transaction: t})
            })
            .then(function() {
                return queryInterface.removeColumn('Tweets', "has_link", {transaction: t})
            });
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
