var db 				= require("../models/index.js");
var Twitter 		= require('twitter');
var Q 				= require('q');
var CONSUMER_KEY 	= "0CATYOWT4xuugZNXZ1rDVXwBM";
var CONSUMER_SECRET = "mzG2At2kbbOPwdXRP4dhqZjqolghouVPGWjR6iI3E82HOeTEcg";
var twitter_clients = {};
var fetching_twitter_client = {};
var since_id;
var Queue 		= require('bull');
var url   		= require('url');


var redis 		= process.env.REDIS_URL || "redis://h:p1f8cb43296a78a9438a4b604d41a7a070094f416d8fbf3de3e248e7b66461c28@ec2-54-86-200-206.compute-1.amazonaws.com:11399";
var conn_info 	= url.parse(redis, true /* parse query string */);
var http = require("http");
setInterval(function() {

	db.User.findAll()
		.then(function(users) {

			users.forEach(function(user, index) {

				// Store search queries for each user
				db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
				.then(function(search_queries) {

					user.search_queries = search_queries;
					search_twitter(user);

				});

				if (!user.tweet_queue) {

					// Setup queues
					user.tweet_queue 		= Queue(user.screen_name + "TweetQueue",
											// , conn_info.port
											// , conn_info.hostname
											// , {auth_pass: conn_info.auth ? conn_info.auth.replace("h:", "") : ""});
													redis);

					
					// Graceful Shutdown
					process.once( 'SIGTERM', function ( sig ) {
					  user.tweet_queue.close().then(function () {
						   console.log('done')
					   });
					});

					// Listen for errors
					user.tweet_queue.on("error", function(err) {
						console.log("ABS -- Unable to create bull queue" + err);
					})

					// Method to call for TweetQueue jobs added by server

					require('./send_tweet.js')(user.tweet_queue, 1);
				}

			});
		}, function(err) {
			//res.json([]);
	});

}, 300000); // every 5 minutes (300000)



function search_twitter(user) {
	get_twitter_client(user.screen_name, "")
	.then(function(data) {
		var twitter_client 		=  data.twitter_client;
		console.log("Nemam Amma Bhagavan Sharanam -- twitter client", twitter_client);

		// Loop through each keyword
		user.search_queries.forEach((search_query, i) => {
			// temp
			search_query.exclude_links = true;
			var next_since_id 		= search_query.since_id 		? search_query.since_id : "0";
			var exclude_retweets 	= search_query.exclude_retweets ? " exclude:retweets" : "";
			var exclude_links 		= search_query.exclude_links 	? " -filter:links" : "";
			var exclude_media		= search_query.exclude_media	? " -filter:media" : "";

			var twitter_query 		= search_query.keyword + exclude_retweets + exclude_links + exclude_media;
			//  Track tweet
			// var stream = twitter_client.stream('statuses/filter', {track: concated_keywords});
			// stream.on('data', function(tweet) {
			if (twitter_query.match(/premium/)) {
				twitter_client.get('search/tweets', {q:twitter_query , count: 100, result_type: "recent", since_id: next_since_id, tweet_mode: 'extended'}, function(error, data, response) {
			 	if (error) {
			 		console.log("Nemam Amma Bhagavan Sharanam -- error", error);
			 	}
			 	if (data["statuses"]){

				 	var tweets = data["statuses"];
				 	
				 	console.log("Nemam Amma Bhagavan Sharanam -- tweets", tweets)
					// Loop through each tweet if exists, get the search query and update it
					if (tweets.length > 0) {

						tweets.forEach((tweet, index) => {

							next_since_id = tweet.id_str > next_since_id ? tweet.id_str : next_since_id;
							if (search_query.exclude_bots  && !tweet.source.match(/twitter\.com/)) return;

						  	// 3. Filter tweets
							 // 	if(((search_query.exclude_media && !tweet.entities.media.length > 0) || !search_query.exclude_media) &&
							 // //  	 ((search_query.exclude_links && !tweet.entities.urls.length > 0)   || !search_query.exclude_links) && 
							 //  	 ((search_query.exclude_rt 	  && !tweet.retweeted_status)   || !search_query.exclude_rt) && 
								// //  ((search_query.exclude_bots  && tweet.source.match(/twitter\.com/))   || !search_query.exclude_bots) 
								// // ) 
								//if (tweet.source.match(/twitter\.com/))
								console.log("Nemam Amma Bhagavan Sharanam -- tweet before filter", tweet);	


							  		var tweet_stored = {
							  							screen_name: 			tweet.user.screen_name,
					   									status_id: 	 			tweet.id_str,
					    								name: 		 			tweet.user.name,
												    	location: 	 			tweet.user.location,	
					    								profile_img_url: 		tweet.user.profile_image_url,
					    								text: 			 		tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text,
					   									in_reply_to_status_id:  tweet.in_reply_to_status_id_str,
					   									engagements:    		new Array()  // Link Click, Favorited, Opened, Replied
					   							};

					   				// 4. Add tweets to db	
									db.Tweet.create(tweet_stored).then((tweet) => {
										console.log("Nemam Amma Bhagavan Sharanam -- tweet event afte filter", tweet );

										db.TweetSearchQuery.create({status_id: 	tweet.status_id, 
																	screen_name: user.screen_name, 
																	keyword:  	 search_query.keyword 
																   });
									});


							 // Enqueue tweet if auto search
							 if(search_query.template_names && search_query.template_names.length > 0) {
   
							 	var job = user.tweet_queue.add({
																keyword: 				search_query.keyword,
 																to_name: 				tweet.user.name,
 																type:					search_query.auto_tweet_type,
																to_screen_name: 		tweet.user.screen_name,
																in_reply_to_status_id:  tweet.id_str,
																user: 					user,
																template_name: 			search_query.template_names[Date.now() % search_query.template_names.length]	
										},{
											attempts	: 2,
											timeout 	: 200 * 1000 // Lots of headroom
										});
							 }

						})
							// Update since_id
						db.SearchQuery.update({since_id: next_since_id}, {where: {screen_name: user.screen_name, keyword: search_query.keyword}});  
	              
					}			
					
				
				} // data.statuses

			}); // client.search
		}
		}); // Loop through search queries
  	});	
}  
	

function search_twitter_streaming(user) {
	
	concat_search_keywords(user)
	.then(function(concated_keywords) {

	// 1. Collect twitter client for user or create new client

		return get_twitter_client(user.screen_name, concated_keywords)
	})
	.then(function(data) {
			var twitter_client 		=  data.twitter_client;
			var concated_keywords 	=  data.concated_keywords;
			// Store this to search keywords after this id to get most results
			var next_since_id 		= user.since_id ? user.since_id : "0";

			console.log("Nemam Amma Bhagavan Sharanam -- concated keywords", concated_keywords);
			//  Track tweet
			// var stream = twitter_client.stream('statuses/filter', {track: concated_keywords});
			// stream.on('data', function(tweet) {
			twitter_client.get('search/tweets', {q: concated_keywords, count: 100, result_type: "recent", since_id: "0"}, function(error, data, response) {
			 	if (error) {
			 		console.log("Nemam Amma Bhagavan Sharanam -- error", error);
			 	}
			 	if (data["statuses"]){

				 	var tweets = data["statuses"];
				 	
				 	console.log("Nemam Amma Bhagavan Sharanam -- tweets", tweets)
					// Loop through each tweet if exists, get the search query and update it
					if (tweets.length > 0) {

						tweets.forEach((tweet, index) => {
							console.log("Nemam Amma Bhagavan Sharanam -- tweet is", tweet);
							next_since_id = tweet.id_str > next_since_id ? tweet.id_str : next_since_id;

						 	find_search_queries_in_tweet(user, tweet)
						 	.then(function(data){
						 		var search_queries_in_tweet = data.search_queries_in_tweet;
						 		var tweet 					= data.tweet;
								search_queries_in_tweet.map(function(search_query, index) {	

						  	// 3. Filter tweets
							 // 	if(((search_query.exclude_media && !tweet.entities.media.length > 0) || !search_query.exclude_media) &&
							 // //  	 ((search_query.exclude_links && !tweet.entities.urls.length > 0)   || !search_query.exclude_links) && 
							 //  	 ((search_query.exclude_rt 	  && !tweet.retweeted_status)   || !search_query.exclude_rt) && 
								// //  ((search_query.exclude_bots  && tweet.source.match(/twitter\.com/))   || !search_query.exclude_bots) 
								// // ) 
								//if (tweet.source.match(/twitter\.com/))
								{
									console.log("Nemam Amma Bhagavan Sharanam -- tweet before filter", tweet);	


							  		var tweet_stored = {
							  						screen_name: 			tweet.user.screen_name,
					   								status_id: 	 			tweet.id_str,
					    							name: 		 			tweet.user.name,
												    location: 	 			tweet.user.location,	
					    							profile_img_url: 		tweet.user.profile_image_url,
					    							text: 			 		tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text,
					   								in_reply_to_status_id:  tweet.in_reply_to_status_id_str,
					   								engagements:    		new Array()  // Link Click, Favorited, Opened, Replied
					   							}
					   				// 4. Add tweets to db	
									db.Tweet.create(tweet_stored);
									console.log("Nemam Amma Bhagavan Sharanam -- tweet event afte filter", tweet );

									db.TweetSearchQuery.create({status_id: 	tweet.id_str, 
																screen_name: user.screen_name, 
																keyword:  	 search_query.keyword 
															   });
									
								} // filter tweet

							}); // map each keyword

						}); // lookup keyword
					}); // loop through tweets
					// Update since_id
					db.User.update({since_id: next_since_id}, {where: {screen_name: user.screen_name}});  
	                
	 			} // tweets found
	 		} // statuses object exists
		   
		}); // search twitter

		// stream.on('error', function(error) {
		//    console.log("Nemam Amma Bhagavan Sharanam -- error", error)
		// });
	});

}

// 1. Find all search queries for user
// 2. Check which keywords are found in tweet
// 3. Return array of keywords


function find_search_queries_in_tweet(user, tweet) {
	var q 				  = Q.defer();
	var search_queries_in_tweet = new Array();

	// Avoid constant lookups
	
	user.search_queries.forEach(function(search_query, index) {
		if (!search_query.keyword.match(/sales/)) {

			// 1. Check if its a quoted keyword

			// 2. If not collect list of words and check if each word
			// exists in the text
			// if one word fails, then set it to false

			var words 	= search_query.keyword.split(/\s/);
			var found  	= true;
			words.forEach((word, i) => { 

				var reg_exp = new RegExp(search_query.keyword, 'i');
				if (tweet.extended_tweet) {
					if (!tweet.extended_tweet.full_text.match(reg_exp))
						found = false;

				}
				else if (!tweet.text.match(reg_exp)) {
						found = false;
				}
			});

			if (found) search_queries_in_tweet.push(search_query);
		}
	});

	q.resolve({search_queries_in_tweet: search_queries_in_tweet, tweet: tweet});

	return q.promise;
}

function concat_search_keywords(user) {
	
	var q = Q.defer();

	var concated_keywords = "";
	// 1. Concat all queries for the user seperated by comma
	db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
	.then(function(search_queries) {

		search_queries.forEach(function(search_query, index) {
			if (search_query.keyword.match(/sales/)) return;

			concated_keywords =  "(" + search_query.keyword + ") OR " + concated_keywords;
		
		});
		// Remove last comma
		concated_keywords = concated_keywords.slice(0, concated_keywords.length - 4);
		q.resolve(concated_keywords);
	});

	return q.promise;
}
// 3. Parse tweet

//  4. Add tweet to database

// 5. Auto tweet

function get_twitter_client(screen_name, concated_keywords) {
	var q 	=	Q.defer();

	if (twitter_clients[screen_name]) q.resolve({twitter_client: twitter_clients[screen_name], concated_keywords: concated_keywords});

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
