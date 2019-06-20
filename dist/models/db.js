"use strict";
//import * as Sequelize from 'sequelize'
const fs = require("fs");
var Sequelize = require('../../node_modules/sequelize/lib/sequelize');
const path = require("path");
let basename = path.basename(__filename);
let env = process.env.NODE_ENV || 'development';
//let config    = require(__dirname + '/../config/config.json')[env];
let db = {
    sequelize: null,
    Sequelize: null,
};
if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    db.sequelize = new Sequelize(process.env.DATABASE_URL, {
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": true
        },
        protocol: 'postgres',
    });
}
else {
    // the application is executed on the local machine
    db.sequelize = new Sequelize("postgres://kqmijsvqwbismx:e2f0d9106a23afa3f874a339632b61d5414329a2cb3a2ee2d41b23fec2769599@ec2-54-221-207-184.compute-1.amazonaws.com:5432/d4ksp8ah9l34pd", {
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": true
        },
        protocol: 'postgres',
        pool: {
            max: 1000,
            min: 0,
            idle: 20000,
        }
    });
}
db.Sequelize = Sequelize;
console.log("Nemam Amma Bhagavan Sharanam -- sequelize connection", db.sequelize);
fs
    .readdirSync(__dirname)
    .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(file => {
    var model = db.sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
module.exports = db;
//# sourceMappingURL=db.js.map