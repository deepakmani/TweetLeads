'use strict';
var pg        = require('pg');
pg.defaults.ssl = true;

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('../../node_modules/sequelize/lib/sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var sequelize;

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
     "dialect":"postgres",
      "ssl": true,
      "dialectOptions": {
            "ssl": true
      },
    protocol: 'postgres',
  });
} else {
  // the application is executed on the local machine
  sequelize = new Sequelize("postgres://kqmijsvqwbismx:e2f0d9106a23afa3f874a339632b61d5414329a2cb3a2ee2d41b23fec2769599@ec2-54-221-207-184.compute-1.amazonaws.com:5432/d4ksp8ah9l34pd"
              , {
                 "dialect":"postgres",
                  "ssl": true,
                  "dialectOptions": {
                        "ssl": true
                  },
                protocol: 'postgres',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 20000,
                    acquire: 20000
                }
              });
}

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


console.log("Nemam Amma Bhagavan Sharanam -- exporting db");
module.exports = db;
