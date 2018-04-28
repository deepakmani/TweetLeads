var db 				= require("../models/index.js");
var Twitter 		= require('twitter');
var Q 				= require('q');
var CONSUMER_KEY 	= "2i9EW8WkyIEr7ZwR9oO4KZWUU";
var CONSUMER_SECRET = "V95tZ7T6Ed3Q1LnokwrxSSir7vKzR7RtQKgsmSjKYFHCccyC9s";
var twitter_clients = {};
var fetching_twitter_client = {};

// Setup Twitter Search Streams for all the queries
db.User.findAll()
	.then(function(users) {

		users.forEach(function(user, index) {
			start_twitter_stream(user);
		});
	}, function(err) {
		//res.json([]);
});

function start_twitter_stream(user) {
	
	concat_search_keywords(user)
	.then(function(concated_keywords) {

	// 1. Collect twitter client for user or create new client
					console.log("Nemam Amma Bhagavan Sharanam concated keywords", concated_keywords)

		return get_twitter_client(user.screen_name, concated_keywords)
	})
	.then(function(data) {
			var twitter_client 		=  data.twitter_client;
			var concated_keywords 	=	data.concated_keywords;
			//  Track tweet
			var stream = twitter_client.stream('statuses/filter', {track: concated_keywords});
			stream.on('data', function(tweet_event) {

			 	find_search_queries_in_tweet(user, tweet_event)
			 	.then(function(search_queries){
					search_queries.map(function(search_query, index) {	

			  	// 3. Filter tweets
				 // 	if(((search_query.exclude_media && !tweet_event.entities.media.length > 0) || !search_query.exclude_media) &&
				 // //  	 ((search_query.exclude_links && !tweet_event.entities.urls.length > 0)   || !search_query.exclude_links) && 
				 //  	 ((search_query.exclude_rt 	  && !tweet_event.retweeted_status)   || !search_query.exclude_rt) && 
					// //  ((search_query.exclude_bots  && tweet_event.source.match(/twitter\.com/))   || !search_query.exclude_bots) 
					// // ) 
					if (tweet_event.source.match(/twitter\.com/))
					{
						console.log("Nemam Amma Bhagavan Sharanam -- tweet_event before filter", tweet_event);	


				  		var tweet = {
				  						screen_name: 			tweet_event.user.screen_name,
		   								status_id: 	 			tweet_event.id_str,
		    							name: 		 			tweet_event.user.name,
									    location: 	 			tweet_event.user.location,	
		    							profile_img_url: 		tweet_event.user.profile_image_url,
		    							text: 			 		tweet_event.extended_tweet ? tweet_event.extended_tweet.full_text : tweet_event.text,
		   								in_reply_to_status_id:  tweet_event.in_reply_to_status_id_str,
		   								engagements:    		new Array()  // Link Click, Favorited, Opened, Replied
		   							}
		   				// 4. Add tweets to db	
						db.Tweet.create(tweet);
						console.log("Nemam Amma Bhagavan Sharanam -- tweet event afte filter", tweet_event );

						db.TweetSearchQuery.create({status_id: 	tweet_event.id_str, 
													screen_name: user.screen_name, 
													keyword:  	 search_query.keyword 
												   });
						
					}

				});

			});
		  
		});

		stream.on('error', function(error) {
		   console.log("Nemam Amma Bhagavan Sharanam -- error", error)
		});
	});

}

// 1. Find all search queries for user
// 2. Check which keywords are found in tweet
// 3. Return array of keywords


function find_search_queries_in_tweet(user, tweet_event) {
	var q 				  = Q.defer();
	var search_queries_in_tweet = new Array();

	// Avoid constant lookups
	db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
	.then(function(search_queries) {

		search_queries.forEach(function(search_query, index) {
			if (!search_query.keyword.match(/sales/)) {

				var reg_exp = new RegExp(search_query.keyword);
				if (tweet_event.extended_tweet) {
					if (tweet_event.extended_tweet.full_text.match(reg_exp))
						search_queries_in_tweet.push(search_query);

				}
				else if (tweet_event.text.match(reg_exp)) {
					search_queries_in_tweet.push(search_query);
				}
			}
		});

		q.resolve(search_queries_in_tweet);
	});

	return q.promise;
}

function concat_search_keywords(user) {
	
	var q = Q.defer();

	var concated_keywords = "";
	// 1. Concat all queries for the user seperated by comma
	db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
	.then(function(search_queries) {

		search_queries.forEach(function(search_query, index) {
			if (!search_query.keyword.match(/sales/)) return;

			concated_keywords = search_query.keyword + "," + concated_keywords;
		
		});
		// Remove last comma
		concated_keywords = concated_keywords.slice(0, concated_keywords.length - 1);
		q.resolve(concated_keywords);
	});

	return q.promise;
}
// 3. Parse tweet

//  4. Add tweet to database

// 5. Auto tweet

function get_twitter_client(screen_name, concated_keywords) {
	var q 	=	Q.defer();

	if (twitter_clients[screen_name]) q.resolve(twitter_clients[screen_name]);

	else {
			console.log("Nemam Amma Bhagavan Sharanam -- setting up new client",);
			var oauth_credentials = {
										consumer_key: 		CONSUMER_KEY,
										consumer_secret: 	CONSUMER_SECRET
									 }
			// 0 Lookup access tokens
			db.User.findOne({where: {screen_name: screen_name}})
			.then(function(user){
				oauth_credentials.access_token_key  	= user.access_token_key;
				oauth_credentials.access_token_secret  	= user.access_token_secret;
				var twitter_client = new Twitter(oauth_credentials);

				// 2. update hash table
				twitter_clients[screen_name] = twitter_client;

				q.resolve({twitter_client: twitter_clients[screen_name], concated_keywords: concated_keywords})

			})
		}
		// 1 create twitter client 
	

	return q.promise;
}
