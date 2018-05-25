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
          return queryInterface.removeColumn('SearchQueries', 'enable_auto_tweet', {transaction: t})
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'auto_tweet_type', Sequelize.STRING, {transaction: t})
            })
      })
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
          return queryInterface.removeColumn('SearchQueries', 'auto_tweet_type', {transaction: t})
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'enable_auto_tweet', Sequelize.STRING, {transaction: t})
            })
      })
  }

};
