
module.exports = (sequelize, DataTypes) => {  
  const TweetSearchQuery = sequelize.define('tweetsearchquery', {
   status_id: {
      type: DataTypes.String,
      allowNull: false
    },

    // Foreign key
    screen_name: {
      type:       DataTypes.String,
      allowNull:  false,
      unique:     'searchQueryIndex'
    },

     keyword: {
      type:       DataTypes.String,
      allowNull:  false,
      unique:     'searchQueryIndex'
    },
  });