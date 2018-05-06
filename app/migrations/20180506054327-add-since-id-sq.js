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
          return queryInterface.removeColumn('Users', 'since_id', {transaction: t})
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'since_id', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'template_name', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('SearchQueries', 'auto_tweet_template_name', {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('tweetTemplates', 'template_name', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('tweetTemplates', 'name', {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('sentTweets', 'keyword', Sequelize.STRING, {transaction: t})
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
    return sequelize.transaction(function (t) {
          return queryInterface.addColumn('Users', 'since_id', Sequelize.STRING, {transaction: t})
          .then(function(){
               return queryInterface.removeColumn('SearchQueries', 'since_id', {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('SearchQueries', 'template_name', {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'auto_tweet_template_name', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('tweetTemplates', 'template_name', {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('tweetTemplates', 'name', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('sentTweets', 'keyword', {transaction: t})
            })
      })
  }
};
