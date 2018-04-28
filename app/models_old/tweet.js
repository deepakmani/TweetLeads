'use strict'

module.exports = (sequelize, DataTypes) => {  
  const Tweets = sequelize.define('tweets', {
    // Foreign key
    screen_name: {
      type: DataTypes.String,
      allowNull: false
    },
    status_id: {
      type: DataTypes.String,
      primaryKey: true,
      allowNull: false
    },
    created_at:
    {
      type: DataTypes.DATE
    }
    name: {
      type: DataTypes.String,
      allowNull: false
    },
    location: {
      type: DataTypes.String,
      allowNull: false
    },
    profile_img_url: {
      type: DataTypes.String
    }
    text: {
      type:   DataTypes.String
    },
    media: {
       type:   DataTypes.String
    }
    // Can be search, outreach, reply
    type: {
      type:   DataTypes.String
    },
    in_reply_to_status_id:{
      type:   DataTypes.String
    },
    read: {
      type: DataTypes.boolean,
      defaultValue: false
    }

  });
  
