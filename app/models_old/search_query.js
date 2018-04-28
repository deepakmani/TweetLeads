'use strict'

module.exports = (sequelize, DataTypes) => {  
  const SearchQuery = sequelize.define('searchquery', {
   keyword: {
      type: DataTypes.String,
      allowNull: false,
       unique:     'searchQueryIndex'
    },

    // Foreign key
    screen_name: {
      type: DataTypes.String,
      allowNull: false,
       unique:     'searchQueryIndex'
    },
    exclude_keywords: {
      type: DataTypes.array(DataTypes.text)
    },
    exclude_links: {
      type: DataTypes.boolean
    },
    exclude_media: {
      type: DataTypes.boolean
    },
    exclude_retweets: {
      type: DataTypes.boolean
    },
    locations:{
      type: DataTypes.String
    },
    // Can be: keyword, profile or followers query
    type: {
      type: DataTypes.String
    },
    // defaults to none
    category: {
      type: DataTypes.String
    },
    // No, auto_tweet, auto_reply
    enable_auto_tweet: {
      type: DataTypes.String
    },
    auto_tweet_template_id: {
      type: DataTypes.UUID 
    }

   
  });
  