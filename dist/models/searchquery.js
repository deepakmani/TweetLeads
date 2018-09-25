'use strict';
module.exports = (sequelize, Sequelize) => {
    var SearchQuery = sequelize.define('SearchQuery', {
        keyword: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'searchQueryIndex',
            primaryKey: true
        },
        // Foreign key
        screen_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'searchQueryIndex',
            primaryKey: true
        },
        exclude_keywords: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        exclude_links: {
            type: Sequelize.BOOLEAN
        },
        exclude_media: {
            type: Sequelize.BOOLEAN
        },
        exclude_retweets: {
            type: Sequelize.BOOLEAN
        },
        locations: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        // Can be: keyword, profile or followers query
        type: {
            type: Sequelize.STRING
        },
        // defaults to none
        category: {
            type: Sequelize.STRING
        },
        // tweet, reply
        auto_tweet_type: {
            type: Sequelize.STRING
        },
        template_names: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
            //  defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        },
        // Last search using this api key
        since_id: {
            type: Sequelize.STRING
        },
    });
    SearchQuery.associate = function (models) {
        SearchQuery.belongsTo(models.User, {
            foreignKey: 'screen_name',
            onDelete: 'CASCADE'
        });
    };
    SearchQuery.associate = function (models) {
        SearchQuery.belongsToMany(models.Tweet, {
            through: models.TweetSearchQuery,
            foreignKey: 'keyword', scope: { screen_name: { $col: 'TweetSearchQuery.screen_name' } }
        });
    };
    return SearchQuery;
};
//# sourceMappingURL=searchquery.js.map