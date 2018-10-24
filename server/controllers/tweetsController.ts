import * as express 		from "express";
import * as db 				from "../models/db";
import * as Queue  		 	from "bull"


export class TweetsController {

	public static redis: 				String 	= process.env.REDIS_URL || "redis://h:p62c73e309976e24e04f61384dcf4d43ef932766db389a8925ed75a0c1ec9d8f7@ec2-18-205-52-161.compute-1.amazonaws.com:27639";
	public static send_tweet_queues:  	any 	= {};

	constructor(app: express.Application) {
		// Setup routes
		//this.routes(app)
	}

    
	public static routes = function(app) {
		app.get("/api/getTweetCountBySearchQuery", this.getTweetCountBySearchQuery);
		app.get("/api/getTweetsBySearchQueryAndActionType", this.getTweetsBySearchQueryAndActionType)
		app.post("/api/bulkMarkTweetsAsRead", this.bulkMarkTweetsAsRead);
		app.post("/api/sendTweet", this.sendTweet);

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
	    	
	    	console.log("Nemam Amma Bhagavan Sharanam -- counts", counts[0]);
	    	
			res.json({new_tweet_count: counts[0].new_tweet_count,  
				      // contacted_count: counts.contacted_count, 
				      // replied_count: replied_count, 
				      // followed_count: followed_count, 
				      // saved_count: saved_count, 
				      read_tweet_count: counts[0].read_tweet_count });
			    // We don't need spread here, since only the results will be returned for select queries
		}, (err) => {
			res.json(false);
		});
	}

	/*
	@name:  	getTweetsBySearchQueryAndActionType
	@params: 	screen_name, status_ids
	@descr: 	set read field to true
	@out: 		json: true / false
	*/

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
	
	/*
	@name:  	bulkMarkTweetsAsRead
	@params: 	screen_name, status_ids
	@descr: 	set read field to true
	@out: 		json: true / false
	*/

	public static bulkMarkTweetsAsRead = function(req, res) {
		let screen_name 	= req.body.screen_name;
		let status_ids 		= req.body.status_ids;
		const Op = require('Sequelize').Op;
		console.log("Nemam Amma Bhagavan Sharanam -- status_ids read", status_ids);
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

	/*
	@name:  	sendTweets
	@params: 	tweetText, to_screen_name, keyword, type (Read / Mention), Template
	*/
	public static sendTweet(req, res) {

		let screen_name = req.body.screen_name;

        if (!TweetsController.send_tweet_queues[screen_name]) {
			// Setup queues
			TweetsController.send_tweet_queues[screen_name] 		= Queue(screen_name + "SendTweetQueue",
										// , conn_info.port
										// , conn_info.hostname
										// , {auth_pass: conn_info.auth ? conn_info.auth.replace("h:", "") : ""});
												TweetsController.redis);
		
				// Listen for errors
				TweetsController.send_tweet_queues[screen_name].on("error", function(err) {
					console.log("ABS -- Unable to create bull queue" + err);
				});

				// Graceful Shutdown
				process.once( 'SIGTERM', function ( sig ) {
				 TweetsController.send_tweet_queues[screen_name].close().then(function () {
					   console.log('done')
				   });
				});

		}

		let job = TweetsController.send_tweet_queues[screen_name].add({
																keyword: 				req.body.keyword,
 																to_name: 				req.body.to_name,
 																type:					req.body.auto_tweet_type,
																to_screen_name: 		req.body.to_screen_name,
																in_reply_to_status_id:  req.body.in_reply_to_status_id,
																screen_name: 			screen_name,
																template_name: 			req.body.template_name,
																text: 					req.body.text
															},
															{
																attempts	: 2,
																timeout: 200 * 1000 // Lots of headroom
															})
														.then((data) => {
															res.json(true);
														})
														.catch((err) => {
															res.json(false)
														});


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
