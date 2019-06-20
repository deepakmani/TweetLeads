import * as express 		from "express";
import * as db 				from "../models/db";
import { TwitterStreams } 	from "../worker/twitter_streams";

export class SearchQueriesController {
	constructor(app: express.Application) {
		// Setup routes
	}


	public static routes = function(app) {
		app.post("/api/saveNewSearchQuery", this.saveNewSearchQuery);
		app.get("/api/getSearchQueries", this.getSearchQueries)
	}

	public static saveNewSearchQuery = function(req, res) {
	      	// 1. Check if user is signed in
	      	var new_search_queries = Array<SearchQuery>();

	      	// 2. 
	      	let new_search_query = 	req.body.new_search_query; 
  			  // Temp
  			 new_search_query.template_names = [];
  			 new_search_query.locations = [];
  			 new_search_queries.push(new_search_query);
  	
	      	console.log("Nemam Amma Bhagavan Sharanam", new_search_query);
	      	// 3. Insert into db.sequelize 
	      	db["SearchQuery"].create(new_search_query)
		    .then(added_search_query => {
		      console.log("Nemam Amma Bhagavan Sharanam -- added", added_search_query);
		    
		       TwitterStreams.search_twitter(new_search_query.screen_name, new_search_query)	
				.then((tweets) => {
		    		 res.json({status:true, tweets: tweets});
		   		 })
		    })
		   
		    .catch((err) => {
		      console.log("Nemam Amma Bhagavan Sharanam -- error", err);
		      res.json({status:false});	
		    })
	      	// 4. Return status

	      	// 5. Enqueue stream
	   //   	var job = new_twitter_search_stream_queue.add({
	   //   										new_search_queries: new_search_queries
	   //   									} ,{
				// 							attempts	: 2,
				// 							timeout 	: 200 * 1000 // Lots of headroom
				// });

		}
	

	/* @name:   getSearchQueries
	   @params: user
	   @descr:  Select SearchQueries with tweet count
	*/   			
		 
	public static getSearchQueries = function(req, res) {
		let screen_name = req.query.screen_name;
		db.sequelize.query("SELECT * \
							FROM  \"SearchQueries\" \
			  						LEFT OUTER JOIN \
			 					 	(	SELECT keyword, count(status_id) as new_tweets_count  \
			 							FROM \"TweetActions\"  \
			 							WHERE screen_name = '" + screen_name + "' AND  action='new' \
			 							GROUP BY \"TweetActions\".keyword \
		                            ) as NewTweets Using(keyword)"
		                    ,	{ type: db.sequelize.QueryTypes.SELECT})
		.then(search_queries_new_tweets_count => {
				 res.json(search_queries_new_tweets_count);        

		});

		
	}	// getSearchQueries
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
