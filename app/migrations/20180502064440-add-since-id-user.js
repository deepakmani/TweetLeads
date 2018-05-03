'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var sequelize = queryInterface.sequelize;
    
     return sequelize.transaction(function (t) {
          return queryInterface.addColumn('Users', 'since_id', Sequelize.STRING, {transaction: t})
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
        return queryInterface.removeColumn('Users', "since_id", {transaction: t})
      });
  }
};
