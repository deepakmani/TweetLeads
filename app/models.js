const Sequelize = require('sequelize');  
const env 		= require('./env');  
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {  
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  define: {
    underscored: true
  }
});

// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Models/tables
db.user  		= require('./models/user.js')(sequelize, Sequelize); 
db.tweet  		= require('./models/tweet.js')(sequelize, Sequelize);  
db.search_query = require('../models/search_query.js')(sequelize, Sequelize);  
db.tweet_search_query = require('../models/tweet_search_query.js')(sequelize, Sequelize);

db.search_query.belongsTo(db.user);  
db.user.hasMany(db.search_query);

db.tweet.belongsTo(db.user);  
db.user.hasMany(db.tweet);
search_query.belongsToMany(tweet, {
  through: 'tweetsearchquery'
});
tweet.belongsToMany(search_query, {
  through: 'tweetsearchquery'
});
