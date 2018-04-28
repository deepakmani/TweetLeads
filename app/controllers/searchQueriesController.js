
var db = require("../models/index.js");
// db.User.create({screen_name: 		"DeepakABS", 
// 				plan: 				"Trial",   
// 				name:  				"Deepak Mani", 
// 				profile_img_url: 	"none", 
// 			    access_token_key: 	"1724608555-2AfqipBQ2ziRnex51pJeLEncBlsehxn9OcqTwDS",
//     			access_token_secret:"IvbzE2Ngob3AQeuTBJ5J3Uv8m3sbJHb0fzXsi3hKxCjzN"})
// 		    .then(user => {
// 		      console.log("Nemam Amma Bhagavan Sharanam -- added user", user);
// 		    }, err => {
// 		      console.log("Nemam Amma Bhagavan Sharanam -- unable to add user");	
// 		    })
var Queue 		= require('bull');
var url   		= require('url');


var redis 		= process.env.REDIS_URL || "redis://h:pd2145milnfh7r6aud3i28esecg@ec2-54-225-248-10.compute-1.amazonaws.com:7999";

var conn_info 	= url.parse(redis, true /* parse query string */);
console.log("Nemam Amma Bhagavan Sharanam -- conn_info", conn_info);
//var new_twitter_search_stream_queue = Queue("NewTwitterSearchStream", conn_info.port, conn_info.hostname, {auth_pass: conn_info.auth ? conn_info.auth.replace("h:", "") : ""});


module.exports = function(db) {
	  // Get method
      var SearchQueriesController =  {
      	getSearchQueries: function(req, res) {

      		// Collect authenticated user using req.user.screen_name?
      		var screen_name 		= req.query.screen_name;
      		const attributes 	= ['keyword', 
                                   'screen_name',
                                    'category',
                                    'type',
                                    'locations',
                                    'exclude_retweets',
                                    'exclude_media',
                                     'exclude_links',
                                    'exclude_bots',
                                    'exclude_keywords',
                                    'enable_auto_tweet',
      								[db.sequelize.fn('COUNT', db.sequelize.col('status_id')), 'tweet_count']];

			const group = ['keyword', 
                           'screen_name',
                            'category',
                            'type',
                            'locations',
                            'exclude_retweets',
                            'exclude_media',
                             'exclude_links',
                            'exclude_bots',
                            'exclude_keywords',
                            'enable_auto_tweet'
                           ];
			const order = ['tweet_count', 'DESC'];

			// Calculate total tweets
      		const include = [{
      							model: db.Tweet,
       						    required: false
       						}];
       						
 			db.sequelize.query( 
 								// "SELECT \"SearchQueries\".category, \"SearchQueries\".keyword, \"SearchQueries\".screen_name, \"SearchQueries\".type,  query_tweet_table.tweet_count as \"tweet_count\" \
 								// FROM \( SELECT \"SearchQueries\".keyword, Count\(status_id\) as \"tweet_count\" FROM \"SearchQueries\" LEFT OUTER JOIN \"TweetSearchQueries\" ON \"SearchQueries\".keyword = \"TweetSearchQueries\".keyword \
  							//     GROUP BY \"SearchQueries\".keyword \) as query_tweet_table"
  							    "SELECT * FROM \"SearchQueries\" INNER JOIN ( SELECT \"SearchQueries\".keyword, Count(status_id) as \"tweet_count\" FROM \"SearchQueries\" LEFT OUTER JOIN \"TweetSearchQueries\" ON \"SearchQueries\".keyword = \"TweetSearchQueries\".keyword   WHERE \"SearchQueries\".screen_name ='DeepakABS'    GROUP BY \"SearchQueries\".keyword ) as query_tweet_table ON \"SearchQueries\".keyword = query_tweet_table.keyword;\
  							    "
 							  , { type: db.sequelize.QueryTypes.SELECT})
 
			 .then(search_queries => {

			 	console.log('Nemam Amma Bhagavan Sharanam -- search_queries', search_queries);
			 	res.json(search_queries);
			    // We don't need spread here, since only the results will be returned for select queries
			 })
 			//const finder = {attributes: attributes, order: order, include: include, group:group, where: {screen_name: "DeepakABS"}};
       		// db.SearchQuery.findAndCountAll(finder)
      			// 		  .then(function(search_queries) {
      			// 		  	res.json(search_queries);

      			// 		  	console.log("Nemam Amma Bhagavan Sharanam -- search_queries", search_queries);
      			// 		  }, function(err) {
      			// 		  	res.json([]);
      			// 		  	console.log("Nemam Amma Bhagavan Sharanam -- error", err);
      			// 		  })
      			

      	},

        addNewSearchQueries: function(req, res) {
	      	// 1. Check if user is signed in

	      	// 2. Collect all search query objects
	      	var new_search_queries = req.body.new_search_queries;
	      	console.log("Nemam Amma Bhagavan Sharanam -- req", new_search_queries);
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

		},

		// getTweetsForSearchQuery

		// Input: Search Query, User, Page number, number of tweets per page

		// Output:  (TweetSearchQuery inner join tweets)  left outer join tweet actions


	getTweetsBySearchQuery: function(req, res) {
		let screen_name = req.screen_name;
		let keyword 	= req.keyword;

		db.sequelize.query("SELECT * FROM \"Tweets\" INNER JOIN \"TweetSearchQueries\" \
									ON \"Tweets\".status_id = \"TweetSearchQueries\".status_id \
									WHERE \"TweetSearchQueries\".keyword =\'" + keyword +
							 		"\' AND TweetSearchQueries.screen_name=\'" + screen_name + "\';",
			 { type: db.sequelize.QueryTypes.SELECT})
		 .then(tweets => {

			 	console.log('Nemam Amma Bhagavan Sharanam -- tweets', tweets);
			 	res.json(tweets);
			    // We don't need spread here, since only the results will be returned for select queries
			 })
	} 

   
	} // SearchQueriesController; 

	
    return SearchQueriesController; 
};