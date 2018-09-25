'use strict';
module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('User', {
        screen_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profile_img_url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        access_token_key: {
            type: Sequelize.STRING
        },
        access_token_secret: {
            type: Sequelize.STRING
        },
        plan: {
            type: Sequelize.STRING
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
                User.hasMany(models.SearchQuery, {
                    foreignKey: 'screen_name',
                    onDelete: 'CASCADE'
                });
                User.belongsToMany(models.Tweet, {
                    through: models.TweetAction
                });
                User.hasMany(models.tweetTemplate, {
                    foreignKey: 'screen_name',
                    onDelete: 'CASCADE'
                });
                User.hasMany(models.sentTweet, {
                    foreignKey: 'screen_name',
                    onDelete: 'CASCADE'
                });
                // associations can be defined here
            }
        }
    });
    return User;
};
//# sourceMappingURL=user.js.map