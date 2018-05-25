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
   
        return queryInterface.sequelize.query('ALTER TABLE "tweetTemplates" ADD CONSTRAINT "template_pkey" PRIMARY KEY ("screen_name", "template_name")')
         .then(function(){
               return queryInterface.addColumn('sentTweets', 'status', Sequelize.STRING, {transaction: t})
            })
         .then(function(){
               return queryInterface.removeColumn('SearchQueries', 'template_name', {transaction: t})
            })
          .then(function(){
               return queryInterface.addColumn('SearchQueries', 'template_names', Sequelize.ARRAY(Sequelize.STRING), {transaction: t})
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

     return sequelize.transaction(function (t) {
   
        return queryInterface.sequelize.query('ALTER TABLE "tweetTemplates" ADD CONSTRAINT "template_pkey" PRIMARY KEY ("screen_name", "template_name")')
         .then(function(){
               return queryInterface.removeColumn('sentTweets', 'status',  {transaction: t})
            })
         .then(function(){
               return queryInterface.addColumn('SearchQueries', 'template_name', Sequelize.STRING, {transaction: t})
            })
          .then(function(){
               return queryInterface.removeColumn('SearchQueries', 'template_names', {transaction: t})
            })
      });
  }
};
