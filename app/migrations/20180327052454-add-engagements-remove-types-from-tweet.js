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
            return queryInterface.removeColumn('Tweets', "type", {transaction: t})
           .then(function(){
               return queryInterface.removeColumn('Tweets', "link_click", {transaction: t})
            })
          .then(function() {
            return queryInterface.removeColumn('Tweets', "read", {transaction: t})
          })
          .then(function() {
            return queryInterface.removeColumn('Tweets', "created_at", {transaction: t})
          })
          .then(function (){
             return queryInterface.removeColumn('Tweets', "screen_name", {transaction: t})
          })
          .then(function() {
            return queryInterface.addColumn('Tweets', 'engagements', Sequelize.ARRAY(Sequelize.STRING), {transaction: t}) 

          })
          .then(function() {
             return queryInterface.addColumn('Tweets', "screen_name", Sequelize.STRING, {transaction: t})
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
          return queryInterface.addColumn('Tweets', "type", Sequelize.STRING, {transaction: t})
           .then(function(){
               return queryInterface.addColumn('Tweets', "link_click", Sequelize.BOOLEAN, {transaction: t})
            })
           .then(function() {
            return queryInterface.addColumn('Tweets', "read", Sequelize.BOOLEAN, {transaction: t})
          })
          .then(function() {
            return queryInterface.addColumn('Tweets', "created_at", Sequelize.DATE, {transaction: t})
          })
          .then(function() {
            return queryInterface.removeColumn('Tweets', 'engagements', {transaction: t}) 

          })
        });
  }
};
