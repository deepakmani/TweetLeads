'use strict'

module.exports = (sequelize, DataTypes) => {  
  const Query = sequelize.define('queries', {
   query: {
      type: DataTypes.String,
      primaryKey: true,
      allowNull: false
    },

    twitter_handle: {
      type: DataTypes.String,
      allowNull: false
    },
    filter_links: {
      type: DataTypes.boolean
    },
    filter_media: {
      type: DataTypes.boolean
    },
    locations:{
      type: DataTypes.String
    },
    // Can be: keyword, profile or followers query
    type: {
      type: DataTypes.String
    }
  });
  