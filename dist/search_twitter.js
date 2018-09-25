"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/db");
class SearchTwitter {
    constructor() { }
    static setup_twitter_search() {
        this.find_users()
            .then((users) => {
            // For each user
            // Collect earch search query and tokens
            users.map((user) => {
                // Look up search_queries
                // Search Twitter
                // Add tweets
                this.find_search_queries(user)
                    .then((search_queries) => {
                    // For each search query
                    user.search_queries = search_queries;
                    user.search_queries.map((search_query) => {
                        // 1. search_twitter
                        search_twitter(search_query);
                        // 2. Add to tweets model, tweetsearchquery model
                        // 3. s
                    });
                });
            });
        });
    }
    static find_users() {
        return new Promise(function (resolve, reject) {
            db.User.findAll()
                .then(function (users) {
                resolve(users);
            });
        });
    }
}
// 1. 
SearchTwitter.CONSUMER_SECRET = '';
SearchTwitter.CONSUMER_KEY = '';
// Store search queries for each user
SearchTwitter.find_search_queries = (user) => {
    return new Promise(function (resolve, reject) {
        db.SearchQuery.findAll({ where: { screen_name: user.screen_name } })
            .then((search_queries) => {
            resolve(search_queries);
        });
    });
};
//# sourceMappingURL=search_twitter.js.map