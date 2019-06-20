"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/db");
const Queue = require("bull");
const twitter_streams_1 = require("../worker/twitter_streams");
class TweetsController {
    constructor(app) {
        // Setup routes
        //this.routes(app)
    }
    static search_twitter_promise(twitter_client, search_keyword) {
        return new Promise((resolve, reject) => {
            twitter_client.get('search/tweets', { q: search_keyword }, function (error, tweets, response) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(tweets);
                }
            });
        });
    }
    /*
    @name:  	sendTweets
    @params: 	tweetText, to_screen_name, keyword, type (Read / Mention), Template
    */
    static sendTweet(req, res) {
        let screen_name = req.body.screen_name;
        if (!TweetsController.send_tweet_queues[screen_name]) {
            // Setup queues
            TweetsController.send_tweet_queues[screen_name] = Queue(screen_name + "SendTweetQueue", 
            // , conn_info.port
            // , conn_info.hostname
            // , {auth_pass: conn_info.auth ? conn_info.auth.replace("h:", "") : ""});
            TweetsController.redis);
            // Listen for errors
            TweetsController.send_tweet_queues[screen_name].on("error", function (err) {
                console.log("ABS -- Unable to create bull queue" + err);
            });
            // Graceful Shutdown
            process.once('SIGTERM', function (sig) {
                TweetsController.send_tweet_queues[screen_name].close().then(function () {
                    console.log('done');
                });
            });
        }
        let job = TweetsController.send_tweet_queues[screen_name].add({
            keyword: req.body.keyword,
            to_name: req.body.to_name,
            type: req.body.auto_tweet_type,
            to_screen_name: req.body.to_screen_name,
            in_reply_to_status_id: req.body.in_reply_to_status_id,
            screen_name: screen_name,
            template_name: req.body.template_name,
            text: req.body.text
        }, {
            attempts: 2,
            timeout: 200 * 1000 // Lots of headroom
        })
            .then((data) => {
            res.json(true);
        })
            .catch((err) => {
            res.json(false);
        });
    }
}
TweetsController.redis = process.env.REDIS_URL || "redis://h:p62c73e309976e24e04f61384dcf4d43ef932766db389a8925ed75a0c1ec9d8f7@ec2-18-205-52-161.compute-1.amazonaws.com:27639";
TweetsController.send_tweet_queues = {};
TweetsController.routes = function (app) {
    app.get("/api/getTweetCountBySearchQuery", this.getTweetCountBySearchQuery);
    app.get("/api/getTweetsBySearchQueryAndActionType", this.getTweetsBySearchQueryAndActionType);
    app.post("/api/bulkMarkTweetsAsRead", this.bulkMarkTweetsAsRead);
    app.post("/api/sendTweet", this.sendTweet);
    app.get("/api/search_twitter", this.searchTwitter);
};
TweetsController.searchTwitter = function (req, res) {
    // Keyword to search
    var search_query = JSON.parse(req.query.search_query);
    var screen_name = req.query.screen_name;
    db["User"].find({ where: {
            screen_name: screen_name
        } })
        .then((user) => {
        console.log("ABS -- user", user);
        // Twitter client
        return twitter_streams_1.TwitterStreams.search_twitter(screen_name, search_query);
    })
        .then(function (tweets) {
        let tweets_to_send = [];
        if (tweets.length > 0) {
            tweets_to_send = tweets.map((tweet) => {
                let tweet_to_send = {
                    status_id: tweet.id_str,
                    text: tweet.full_text,
                    profile_img_url: tweet.user.profile_image_url,
                    name: tweet.user.name,
                    screen_name: tweet.user.screen_name,
                    location: tweet.user.location,
                    //created_at: 		tweet.
                    followers_count: tweet.user.followers_count,
                    friends_count: tweet.user.friends_count,
                    followers_friends_bucket: tweet.user.friends_count != 0 ? Number(twitter_streams_1.TwitterStreams.round((tweet.user.followers_count / tweet.user.friends_count), .25) * 100) : 0,
                    source: tweet.source,
                    profile_description: tweet.user.description,
                    profile_url: tweet.user.url,
                    in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
                    is_retweet: tweet.retweeted_status ? true : false,
                    is_reply: tweet.in_reply_to_status_id_str ? (tweet.in_reply_to_status_id_str != "null" ? true : false) : false,
                    has_link: tweet.entities.urls.length > 0 ? true : false,
                    is_known_source: tweet.source.match(/twitter\.com/) ? true : false,
                    potential_need_score: 0
                };
                return tweet_to_send;
            });
        }
        res.send(tweets_to_send);
    });
};
TweetsController.getTweetCountBySearchQuery = function (req, res) {
    let screen_name = req.query.screen_name;
    let keyword = req.query.keyword;
    let promises = [];
    let actions = ["new", "direct message", "tweet", "replied", "followed", "favorited", "saved", "read"];
    let result = {};
    //  db.sequelize.query("SELECT  Count(case \"TweetActions\".read when 'false' then 1 else null end) as \"new_tweet_count\", \
    //  							Count(case \"TweetActions\".read when 'true' then 1 else null end) as \"read_tweet_count\" \  FROM \"TweetActions\" \
    // 					WHERE \"TweetActions\".keyword =\'" + keyword +
    // 			 		"\' AND \"TweetActions\".screen_name=\'" + screen_name + "\'\
    // 			 		",
    // { type: db.sequelize.QueryTypes.SELECT})
    db.sequelize.query("SELECT   action, count(*) FROM \"TweetActions\"  \
								WHERE \"TweetActions\".keyword =\'" + keyword +
        "\' AND \"TweetActions\".screen_name=\'" + screen_name + "\'\
						 		GROUP BY action  \
						 		", { type: db.sequelize.QueryTypes.SELECT })
        .then((data) => {
        let action_counts = data[0];
        console.log("Nemam Amma Bhagavan Sharanam -- counts", data);
        action_counts.forEach((action_count) => {
            if (actions.indexOf(action_count.action.toLowerCase()) != -1)
                result[action_count.action.toLowerCase() + "_tweet_count"] = action_count.tweet_count;
        });
        res.json(result);
        // We don't need spread here, since only the results will be returned for select queries
    }, (err) => {
        console.log("Nemam Amma Bhagavan Sharanam -- Error getting counts", err);
        res.json(false);
    });
};
/*
@name:  	getTweetsBySearchQueryAndActionType
@params: 	screen_name, status_ids
@descr: 	set read field to true
@out: 		json: true / false
*/
TweetsController.getTweetsBySearchQueryAndActionType = function (req, res) {
    // Get type 
    let action = req.query.action.toLowerCase();
    let keyword = req.query.keyword;
    let screen_name = req.query.screen_name;
    // If filtering for non-new tweets 
    //      	if (!action.match(/new/i)) {
    db.sequelize.query("SELECT * \
							FROM  \"Tweets\" \
			  						INNER JOIN \
			 					 	(	SELECT status_id  \
			 							FROM \"TweetActions\"  \
			 							WHERE screen_name = '" + screen_name + "' AND keyword='" + keyword +
        "' AND action='" + action + "'" +
        ") as \"SelectedTweets\" Using(status_id) "
        + "ORDER BY tweet_score DESC", { type: db.sequelize.QueryTypes.SELECT })
        .then((tweets) => {
        res.json(tweets);
    })
        .catch((err) => {
        res.json([]);
    });
    //     }
    //     else {
    //     	console.log("Nemam Amma Bhagavan Sharanam -- Sending tweets");
    //     	db.sequelize.query("SELECT * \
    // 					       FROM  \"Tweets\" \
    // 	  						INNER JOIN \
    // 	 					 	(	SELECT status_id  \
    // 	 							FROM \"TweetActions\"  \
    // 	 							WHERE screen_name = '" + screen_name + "' AND keyword='" + keyword +  
    // 	 							 	 "' AND \"TweetActions\".read='false'" + 	
    //                             ") as \"NewTweets\" Using(status_id) " +
    //                             "ORDER BY  has_link ASC, is_retweet ASC, "   +
    //                             "potential_need_score DESC,  followers_friends_bucket DESC, "  +
    //                             "is_known_source DESC,  has_description DESC, has_profile_url DESC "
    //                     , { type: db.sequelize.QueryTypes.SELECT})
    //   		.then((tweets) => {
    //   			console.log("Nemam Amma Bhagavan Sharanam -- tweets", tweets);
    //   			res.json(tweets);
    //   		})
    //   		.catch((err) => {
    //   			console.log("Nemam Amma Bhagavan Sharanam -- err", err);
    //   			res.json([]);
    //   		})
    //     }
    // }
};
/*
@name:  	bulkMarkTweetsAsRead
@params: 	screen_name, status_ids
@descr: 	set read field to true
@out: 		json: true / false
*/
TweetsController.bulkMarkTweetsAsRead = function (req, res) {
    let screen_name = req.body.screen_name;
    let status_ids = req.body.status_ids;
    const Op = require('Sequelize').Op;
    console.log("Nemam Amma Bhagavan Sharanam -- status_ids read", status_ids);
    db.TweetAction.update({ read: true }, { where: {
            screen_name: screen_name,
            status_id: {
                [Op.or]: status_ids
            }
        }
    })
        .then(() => {
        res.json(true);
    })
        .catch(() => {
        res.json(false);
    });
};
exports.TweetsController = TweetsController;
class SearchQuery {
    constructor(keyword, screen_name, category, type, exclude_keywords, exclude_rt, exclude_links, exclude_media) { }
    ;
}
//# sourceMappingURL=tweetsController.js.map