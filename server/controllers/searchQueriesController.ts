import * as express 		from "express";
import * as db 				from "../models/db";

export class SearchQueriesController {
	constructor(app: express.Application) {
		// Setup routes
	}


	public static routes = function(app) {
		app.post("/api/addNewSearchQueries", this.addNewSearchQueries);
		app.get("/api/getSearchQueries", this.getSearchQueries)
	}

	public static addNewSearchQueries = function(req, res) {
	      	// 1. Check if user is signed in
	      	var new_search_queries = Array<SearchQuery>();

	      	// 2. Collect all search query objects
	      	req.body.new_search_queries.forEach(new_search_query => {
	      			  // Temp
	      			 new_search_query.template_names = [];
	      			 new_search_query.locations = [];
	      			 new_search_queries.push(new_search_query);
	      	});
	      	console.log("Nemam Amma Bhagavan Sharanam", new_search_queries);
	      	// 3. Insert into db.sequelize 
	      	db.SearchQuery.bulkCreate(new_search_queries)
		    .then(added_search_queries => {
		      console.log("Nemam Amma Bhagavan Sharanam -- added", added_search_queries);
		       res.json({status:true, added_search_queries: added_search_queries});
		    }, err => {
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
			 							WHERE screen_name = '" + screen_name + "' AND  read='false' \
			 							GROUP BY \"TweetActions\".keyword \
		                            ) as NewTweets Using(keyword)"
		                    ,	{ type: db.sequelize.QueryTypes.SELECT})
		.then(search_queries_new_tweets_count => {
				 console.log("Nemam Amma Bhagavan Sharanam -- search_queries", search_queries_new_tweets_count);
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
