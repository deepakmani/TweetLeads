
module.exports = (sequelize, DataTypes) => {  
  const User = sequelize.define('user', {
    twitter_handle: {
      type: DataTypes.String,
      primaryKey: true,
      allowNull: false
    },
    created_at:
    {
      type:       DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    name: {
      type: DataTypes.String,
      allowNull: false
    },
    profile_img_url: {
      type:      DataTypes.String,
      allowNull: false
    },
    consumer_key: {
      type:      DataTypes.String
    },
    consumer_secret: {
      type:      DataTypes.String
    },
    access_token_key: {
      type:      DataTypes.String
    },
    access_token_secret: {
      type:      DataTypes.String
    },
    plan: {
      type:     DataTypes.String
    }
});