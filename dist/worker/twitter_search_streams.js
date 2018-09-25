"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/db");
const Twitter = require("twitter");
class TwitterStreams {
    constructor() {
        // setup_twitter_search();
    }
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
                        this.search_twitter(user, search_query)
                            .then((tweets) => {
                            tweets.forEach((tweet) => {
                                console.log("Nemam Amma Bhagavan Sharanam -- tweet", tweet);
                            });
                        });
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
    static save_tweets(tweets, search_query) {
        // 1. Extract status_id, text, profile_img_url, name, location, created_at, 
        // screen_name, followers, source, description, profile_url
        tweets.map((tweet) => {
        });
        // 2. Followers Following bucket, has_link, is_retweet,
        // 3. Parse text and find a potential_need_score 
    }
    static search_twitter(user, search_query) {
        return new Promise(function (resolve, reject) {
            this.get_twitter_client(user.screen_name, "")
                .then(function (data) {
                var twitter_client = data.twitter_client;
                //search_query.exclude_links = true;
                var next_since_id = search_query.since_id ? search_query.since_id : "0";
                var exclude_retweets = search_query.exclude_retweets ? " exclude:retweets" : "";
                var exclude_links = search_query.exclude_links ? " -filter:links" : "";
                var exclude_media = search_query.exclude_media ? " -filter:media" : "";
                var twitter_query = search_query.keyword + exclude_retweets + exclude_links + exclude_media;
                //  Track tweet
                // var stream = twitter_client.stream('statuses/filter', {track: concated_keywords});
                // stream.on('data', function(tweet) {
                //if (twitter_query.match(/premium/)) {
                twitter_client.get('search/tweets', { q: twitter_query, count: 100, result_type: "recent", since_id: next_since_id, tweet_mode: 'extended' }, function (error, data, response) {
                    if (error) {
                        console.log("Nemam Amma Bhagavan Sharanam -- error", error);
                    }
                    if (data["statuses"]) {
                        var tweets = data["statuses"];
                        // Loop through each tweet if exists, get the search query and update it
                        if (tweets.length > 0) {
                            resolve(tweets);
                            // Update since_id
                            db.SearchQuery.update({ since_id: tweets[0].id_str }, { where: { screen_name: user.screen_name, keyword: search_query.keyword } });
                        }
                        else
                            resolve([]);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        });
    }
    static get_twitter_client(screen_name, concated_keywords) {
        return new Promise(function (resolve, reject) {
            if (this.twitter_clients[screen_name])
                resolve(this.twitter_clients[screen_name]);
            else {
                console.log("Nemam Amma Bhagavan Sharanam -- setting up new client");
                var oauth_credentials = {
                    consumer_key: this.CONSUMER_KEY,
                    consumer_secret: this.CONSUMER_SECRET,
                    access_token_key: "",
                    access_token_secret: "",
                };
                // 0 Lookup access tokens
                db.User.findOne({ where: { screen_name: screen_name } })
                    .then(function (user) {
                    oauth_credentials.access_token_key = user.access_token_key;
                    oauth_credentials.access_token_secret = user.access_token_secret;
                    var twitter_client = new Twitter(oauth_credentials);
                    // 2. update hash table
                    this.twitter_clients[screen_name] = twitter_client;
                    resolve(this.twitter_clients[screen_name]);
                });
            }
            // 1 create twitter client 
        });
    }
}
// 1. 
TwitterStreams.CONSUMER_KEY = "0CATYOWT4xuugZNXZ1rDVXwBM";
TwitterStreams.CONSUMER_SECRET = "mzG2At2kbbOPwdXRP4dhqZjqolghouVPGWjR6iI3E82HOeTEcg";
TwitterStreams.twitter_clients = {};
// Store search queries for each user
TwitterStreams.find_search_queries = (user) => {
    return new Promise(function (resolve, reject) {
        db.SearchQuery.findAll({ where: { screen_name: user.screen_name } })
            .then((search_queries) => {
            resolve(search_queries);
        });
    });
};
exports.TwitterStreams = TwitterStreams;
//# sourceMappingURL=twitter_search_streams.js.map