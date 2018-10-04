"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tweet {
    constructor() {
    }
}
exports.Tweet = Tweet;
profile_img_url: {
    type: Sequelize.STRING;
}
text: {
    type: Sequelize.TEXT;
}
in_reply_to_status_id: {
    type: Sequelize.STRING;
}
created_at: {
    type: Sequelize.DATE,
    ;
}
createdAt: {
    allowNull: false,
        type;
    Sequelize.DATE,
        defaultValue;
    sequelize.literal('CURRENT_TIMESTAMP'),
    ;
}
followers_count: {
    type: Sequelize.INTEGER,
    ;
}
friends_count: {
    type: Sequelize.INTEGER,
    ;
}
profile_description: {
    type: Sequelize.TEXT;
}
profile_url: {
    type: Sequelize.STRING;
}
source: {
    type: Sequelize.STRING;
}
// ASC sort
has_link: {
    type: Sequelize.BOOLEAN;
}
// ASC sort
is_retweet: {
    type: Sequelize.BOOLEAN;
}
// ASC sort
is_reply: {
    type: Sequelize.BOOLEAN;
}
potential_need_score: {
    type: Sequelize.INTEGER;
}
// 1, 2, 3, 4 based on ratio rounded to quartile
// DESC sort
followers_friends_bucket: {
    type: Sequelize.INTEGER,
    ;
}
// Known sources: twitter, mobile.twitter, hootsuite
// DESC sort
is_known_source: {
    type: Sequelize.BOOLEAN;
}
// DESC Sort 
has_description: {
    type: Sequelize.BOOLEAN;
}
// DESC sort
has_profile_url: {
    type: Sequelize.BOOLEAN;
}
//# sourceMappingURL=tweet.js.map