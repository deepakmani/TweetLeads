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
    app.post("/api/bulkMarkTweetsAsRead", this.bulkMarkTweetsAsRead);
};
TweetsController.getTweetCountBySearchQuery = function (req, res) {
    let screen_name = req.query.screen_name;
    let keyword = req.query.keyword;
    let promises = [];
    let actions = ["new", "contacted", "replied", "followed", "favorited", "saved", "read"];
    db.sequelize.query("SELECT  Count(case \"TweetActions\".read when 'false' then 1 else null end) as \"new_tweet_count\", \
	    							Count(case \"TweetActions\".read when 'true' then 1 else null end) as \"read_tweet_count\" \  FROM \"TweetActions\" \
									WHERE \"TweetActions\".keyword =\'" + keyword +
        "\' AND \"TweetActions\".screen_name=\'" + screen_name + "\'\
							 		", { type: db.sequelize.QueryTypes.SELECT })
        .then((counts) => {
        console.log("Nemam Amma Bhagavan Sharanam -- counts", counts);
        res.json({ new_tweet_count: counts.new_tweet_count,
            // contacted_count: counts.contacted_count, 
            // replied_count: replied_count, 
            // followed_count: followed_count, 
            // saved_count: saved_count, 
            read_tweet_count: counts.read_tweet_count });
        // We don't need spread here, since only the results will be returned for select queries
    }, (err) => {
        res.json(false);
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
/* @Input: screen_name
*/
// Bulk Mark Tweets Read
TweetsController.bulkMarkTweetsAsRead = function (req, res) {
    let screen_name = req.body.screen_name;
    let status_ids = req.body.status_ids;
    const Op = require('Sequelize').Op;
    console.log("Nemam Amma Bhagavan Sharanam -- status_ids read", status_ids);
    // db.TweetAction.update (
    // 		{read: true},
    // 	 	{where: {
    // 	 		screen_name: screen_name,
    // 	 		status_id: 	{
    // 	 				[Op.or]:  	status_ids
    // 	 		}	
    // 	  	}
    // 	  }
    // )
    // .then(() => {
    // 	res.json(true);
    // })
    // .catch(()  => {
    // 	res.json(false);
    // })	 
};
exports.TweetsController = TweetsController;
class SearchQuery {
    constructor(keyword, screen_name, category, type, exclude_keywords, exclude_rt, exclude_links, exclude_media) { }
    ;
}
//# sourceMappingURL=tweetsController.js.map