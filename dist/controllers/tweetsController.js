"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/db");
class TweetsController {
    constructor(app) {
        // Setup routes
        //this.routes(app)
    }
}
TweetsController.routes = function (app) {
    app.get("/api/getTweetCountBySearchQuery", this.getTweetCountBySearchQuery);
    app.get("/api/getTweetsBySearchQueryAndActionType", this.getTweetsBySearchQueryAndActionType);
};
TweetsController.getTweetCountBySearchQuery = function (req, res) {
    let screen_name = req.query.screen_name;
    let keyword = req.query.keyword;
    let promises = [];
    let actions = ["new", "contacted", "replied", "followed", "favorited", "saved", "read"];
    promises.push(db.sequelize.query("SELECT Count(status_id) as tweet_count FROM \"TweetActions\" \
									WHERE \"TweetActions\".keyword =\'" + keyword +
        "\' AND \"TweetActions\".screen_name=\'" + screen_name + "\'\
							 		    AND \"TweetActions\".actions='{}' \
							 		", { type: db.sequelize.QueryTypes.SELECT }));
    // actions.forEach((action) => {
    // 	if (action != "new") {
    // 		promises.push(db.sequelize.query(" (	SELECT count(status_id) as tweet_count  \
    // 		 								FROM \"TweetActions\"  \
    // 		 								WHERE screen_name = '" + screen_name + "' keyword='" + keyword +  
    // 		 							 	 " '" + action + "'=ANY(actions))", 	
    // 					{ type: db.sequelize.QueryTypes.SELECT}));
    // 	}
    // });
    Promise.all(promises.map(p => p.catch(e => e)))
        .then(results => {
        let new_tweets = [];
        let new_count, contacted_count, replied_count, followed_count, favorited_count, saved_count, read_count = 0;
        results.forEach((result, index) => {
            if (!result.match(/Error/)) {
                // New tweets
                switch (index) {
                    case 0:
                        new_count = results[0].tweet_count;
                        break;
                    case 1:
                        contacted_count = results[1].tweet_count;
                        break;
                    case 2:
                        replied_count = results[2].tweet_count;
                        break;
                    case 3:
                        followed_count = results[3].tweet_count;
                        break;
                    case 4:
                        favorited_count = results[4].tweet_count;
                        break;
                    case 5:
                        saved_count = results[5].tweet_count;
                        break;
                    case 6:
                        read_count = results[6].tweet_count;
                        break;
                }
            }
        });
        res.json({ new_count: new_count, contacted_count: contacted_count, replied_count: replied_count, followed_count: followed_count, saved_count: saved_count, read_count: read_count });
        // We don't need spread here, since only the results will be returned for select queries
    });
};
TweetsController.getTweetsBySearchQueryAndActionType = function (req, res) {
    // Get type 
    let action = req.query.action;
    let keyword = req.query.keyword;
    let screen_name = req.query.screen_name;
    // If filtering for non-new tweets 
    if (!action.match(/new/i)) {
        db.sequelize.query("SELECT * \
							FROM  \"Tweets\" \
			  						INNER JOIN \
			 					 	(	SELECT status_id  \
			 							FROM \"TweetActions\"  \
			 							WHERE screen_name = '" + screen_name + " AND ' keyword='" + keyword +
            "' AND " + action + "'=ANY(actions)'" +
            ") as \"SelectedTweets\" Using(status_id) " +
            +"ORDER BY  has_link ASC, is_retweet ASC, " +
            "potential_need_score DESC,  followers_friends_bucket DESC, " +
            "is_known_source DESC,  has_description DESC, has_profile_url DESC", { type: db.sequelize.QueryTypes.SELECT })
            .then((tweets) => {
            res.json(tweets);
        })
            .catch((err) => {
            res.json([]);
        });
    }
    else {
        console.log("Nemam Amma Bhagavan Sharanam -- Sending tweets");
        db.sequelize.query("SELECT * \
							       FROM  \"Tweets\" \
			  						INNER JOIN \
			 					 	(	SELECT status_id  \
			 							FROM \"TweetActions\"  \
			 							WHERE screen_name = '" + screen_name + "' AND keyword='" + keyword +
            "' AND \"TweetActions\".read='false'" +
            ") as \"NewTweets\" Using(status_id) " +
            "ORDER BY  has_link ASC, is_retweet ASC, " +
            "potential_need_score DESC,  followers_friends_bucket DESC, " +
            "is_known_source DESC,  has_description DESC, has_profile_url DESC ", { type: db.sequelize.QueryTypes.SELECT })
            .then((tweets) => {
            console.log("Nemam Amma Bhagavan Sharanam -- tweets", tweets);
            res.json(tweets);
        })
            .catch((err) => {
            console.log("Nemam Amma Bhagavan Sharanam -- err", err);
            res.json([]);
        });
    }
};
exports.TweetsController = TweetsController;
class SearchQuery {
    constructor(keyword, screen_name, category, type, exclude_keywords, exclude_rt, exclude_links, exclude_media) { }
    ;
}
//# sourceMappingURL=tweetsController.js.map