'use strict';
module.exports = (sequelize, Sequelize) => {
    var tweetTemplate = sequelize.define('tweetTemplate', {
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        // Foreign key
        screen_name: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            unique: "templateKey"
        },
        template_name: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            unique: "templateKey"
        },
        // Default or specific
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        link: {
            type: Sequelize.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                tweetTemplate.belongsTo(models.User, {
                    foreignKey: 'screen_name',
                    onDelete: 'CASCADE'
                });
                tweetTemplate.hasMany(models.sentTweet, {
                    foreignKey: "template_name", scope: { screen_name: { $col: 'sentTweet.screen_name' } }
                });
            }
        }
    });
    return tweetTemplate;
};
//# sourceMappingURL=tweettemplate.js.map