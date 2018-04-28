'use strict'

module.exports = (sequelize, DataTypes) => {  
  const Tweet = sequelize.define('tweet', {
    // Foreign key
    screen_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    created_at:
    {
      type: DataTypes.DATE
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_img_url: {
      type: DataTypes.STRING
    },
    text: {
      type:   DataTypes.STRING
    },
    // Can be search, outreach, reply
    type: {
      type:   DataTypes.STRING
    },
    in_reply_to_status_id:{
      type:   DataTypes.STRING
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    link_click: {
      type: DataTypes.BOOLEAN
    }

  });
 
 return Tweet;

};
  
