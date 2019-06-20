'use strict';
module.exports = (sequelize, Sequelize) => {
    var TweetAction = sequelize.define('TweetAction', {
        screen_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: "tweetActionUserIndex"
        },
        // Can be new, friend, tweet, direct message, replied, followed, favorite, read
        action: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: "tweetActionUserIndex"
        },
        tweet_screen_name: {
            type: Sequelize.STRING,
        },
        status_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: "tweetActionUserIndex"
        },
        keyword: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'tweetActionUserIndex',
            primaryKey: true
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return TweetAction;
};
//# sourceMappingURL=tweetaction.js.map