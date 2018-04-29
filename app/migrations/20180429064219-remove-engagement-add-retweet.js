'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var sequelize = queryInterface.sequelize;
        return sequelize.transaction(function (t) {
            return queryInterface.removeColumn('Tweets', "engagements", {transaction: t})
           .then(function(){
               return queryInterface.addColumn('Tweets', 'retweeted_status_id', Sequelize.STRING, {transaction: t})
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
            return queryInterface.removeColumn('Tweets', "retweeted_status_id", {transaction: t})
           .then(function(){
               return queryInterface.addColumn('Tweets', 'engagements', Sequelize.ARRAY(Sequelize.STRING), {transaction: t})
            })
        })
  }
};
