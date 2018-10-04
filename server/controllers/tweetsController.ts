import * as express 		from "express";
import * as db 				from "../models/db";

export class TweetsController {
	constructor(app: express.Application) {
		// Setup routes
		//this.routes(app)
	}


	public static routes = function(app) {
		app.get("/api/getTweetCountBySearchQuery", this.getTweetCountBySearchQuery);
		app.get("/api/getTweetsBySearchQueryAndActionType", this.getTweetsBySearchQueryAndActionType)
		app.post("/api/bulkMarkTweetsAsRead", this.bulkMarkTweetsAsRead);

	}

	public static getTweetCountBySearchQuery = function(req, res) {
		let screen_name = req.query.screen_name;
		let keyword 	= req.query.keyword;
		let promises 	= [];
	 	let actions = ["new", "contacted", "replied", "followed", "favorited", "saved", "read"]


	    db.sequelize.query("SELECT  Count(case \"TweetActions\".read when 'false' then 1 else null end) as \"new_tweet_count\", \
	    							Count(case \"TweetActions\".read when 'true' then 1 else null end) as \"read_tweet_count\" \  FROM \"TweetActions\" \
									WHERE \"TweetActions\".keyword =\'" + keyword +
							 		"\' AND \"TweetActions\".screen_name=\'" + screen_name + "\'\
							 		",
			 { type: db.sequelize.QueryTypes.SELECT})
	    .then((counts) => {
	    	
	    	console.log("Nemam Amma Bhagavan Sharanam -- counts", counts);
	    	
			res.json({new_tweet_count: counts.new_tweet_count,  
				      // contacted_count: counts.contacted_count, 
				      // replied_count: replied_count, 
				      // followed_count: followed_count, 
				      // saved_count: saved_count, 
				      read_tweet_count: counts.read_tweet_count });
			    // We don't need spread here, since only the results will be returned for select queries
		}, (err) => {
			res.json(false);
		});
	}
	public static getTweetsBySearchQueryAndActionType = function(req, res) {
	      	// Get type 
	      	let action 			= req.query.action;
	      	let keyword		 	= req.query.keyword;
	      	let screen_name 	= req.query.screen_name;

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
		                            + "ORDER BY  has_link ASC, is_retweet ASC, " + 
		                            "potential_need_score DESC,  followers_friends_bucket DESC, " +  
		                            "is_known_source DESC,  has_description DESC, has_profile_url DESC"
		                    , { type: db.sequelize.QueryTypes.SELECT})
		  		.then((tweets) => {
		  			res.json(tweets);
		  		})
		  		.catch((err) => {
		  			res.json([]);
		  		})

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
		                            "ORDER BY  has_link ASC, is_retweet ASC, "   +
		                            "potential_need_score DESC,  followers_friends_bucket DESC, "  +
		                            "is_known_source DESC,  has_description DESC, has_profile_url DESC "
		                    , { type: db.sequelize.QueryTypes.SELECT})
		  		.then((tweets) => {
		  			console.log("Nemam Amma Bhagavan Sharanam -- tweets", tweets);
		  			res.json(tweets);
		  		})
		  		.catch((err) => {
		  			console.log("Nemam Amma Bhagavan Sharanam -- err", err);
		  			res.json([]);
		  		})
		    }
		}
	
	/* @Input: screen_name
	*/	 
	// Bulk Mark Tweets Read
	public static bulkMarkTweetsAsRead = function(req, res) {
		let screen_name 	= req.body.screen_name;
		let status_ids 		= req.body.status_ids;
		const Op = require('Sequelize').Op;

		db.TweetAction.update (
				{read: true},
			 	{where: {
			 		screen_name: screen_name,
			 		status_id: 	{
			 				[Op.or]:  	status_ids
			 		}	
			  	}
			  }
		)
		.then(() => {
			res.json(true);
		})
		.catch(()  => {
			res.json(false);
		})	 
	}
}

class SearchQuery {
	
	constructor( keyword: 		string, 
				 screen_name: 	string,
				 category: 		string,
				 type: 			string,
				 exclude_keywords: 	Array<string>,
				 exclude_rt: 		Boolean,
				 exclude_links: 	Boolean,
				 exclude_media: 		Boolean)

 				{};

}
