import * as db from '../models/db'
import * as Twitter from "twitter"

export class TwitterStreams {
	// 1. 
	static CONSUMER_KEY 	= "0CATYOWT4xuugZNXZ1rDVXwBM";
 	static CONSUMER_SECRET  = "mzG2At2kbbOPwdXRP4dhqZjqolghouVPGWjR6iI3E82HOeTEcg";

	static 	twitter_clients = {}; 
	constructor() {
		// setup_twitter_search();
	}

	public static setup_twitter_search() {
        setInterval(() => {
        	this.find_users()
	        .then((users: Array<any>) => {


	      		// For each user
	      		// Collect earch search query and tokens

	      		users.map((user) => {
	      			// Look up search_queries
	      			// Search Twitter
	      			// Add tweets
	      			this.find_search_queries(user)
	      			.then((search_queries) => {
	      				// For each search query
	      				user.search_queries = search_queries;

	      				user.search_queries.map((search_query) => {
	      					// 1. search_twitter

	      					this.search_twitter(user, search_query)
	      					.then((tweets: Array<any>) => {
	      						tweets.forEach((tweet) => {
	      							console.log("Nemam Amma Bhagavan Sharanam -- tweet", tweet);	
	      						});
	      						return this.save_tweets(tweets, search_query);
	      					})
	      					.then()
	      					// 2. Add to tweets model, tweetsearchquery model
	      					// 3. s

	      				}); 
	      			});
	      		})
	      })
		}, 5 * 60 * 1000);
	}

	// Store search queries for each user
	public static find_search_queries = (user) => {
		return new Promise(function(resolve, reject) {
			db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
			.then((search_queries) => {
				resolve(search_queries);
			});
			
		});
	}

	public static find_users() {

		return new Promise(function(resolve, reject) {  
			db.User.findAll()
				.then(function(users) {
					resolve(users);
				});
		});		
	}

	public static save_tweets(tweets, search_query) {
		// 1. Extract status_id, text, profile_img_url, name, location, created_at, 
		// screen_name, followers, source, description, profile_url

		var since_id 	   = search_query.since_id;

		let tweets_to_save = tweets.map((tweet) => {
            since_id =  Number(tweet.id_str) > Number(since_id) ? tweet.id_str : since_id;

   			let tweet_to_save = {
								status_id: 					tweet.id_str,
								text: 						tweet.full_text,
								profile_img_url: 			tweet.user.profile_image_url,
								name: 						tweet.user.name,
								screen_name: 				tweet.user.screen_name,
								location: 					tweet.user.location,
								//created_at: 		tweet.
								followers_count: 			tweet.user.followers_count,
								friends_count: 				tweet.user.friends_count,
								followers_friends_bucket: 	tweet.user.friends_count != 0 ? Number(this.round((tweet.user.followers_count / tweet.user.friends_count), .25) *  100) : 0,
								source: 					tweet.source,
								profile_description: 		tweet.user.description,
								profile_url: 				tweet.user.url,
								in_reply_to_status_id_str: 	tweet.in_reply_to_status_id_str,
								is_retweet: 				tweet.retweeted_status ? true : false,
								is_reply: 					tweet.in_reply_to_status_id_str ? (tweet.in_reply_to_status_id_str != "null" ? true : false)  : false,
								has_link: 					tweet.entities.urls.length > 0 ? true : false,
								is_known_source: 		    tweet.source.match(/twitter\.com/) ?  true : false,
								potential_need_score: 		0
			} 
			let potential_need_keywords = [];
		 	let comparison_keywords 	= ["more", "most", "less", "least", "Better", \
		 							   "Many", "Much", "Difference", "prefer"];    
        	potential_need_keywords 	= potential_need_keywords.concat(comparison_keywords);
			// 2. Question
			// How, Which, What, Is (starting keyword), Does, why, can (starting)
			let question_keywords 		= ["how", "which", "what", "is", "does", "why", "where", "can", "has"];
			potential_need_keywords 	= potential_need_keywords.concat(question_keywords);
			
			// 3. Request
			// Need, Decide, Decided, recommend, suggest,       
			let request_keywords   		= ["need", "tried", "suggest", "suggestion", "recommend", "decide", "decided", "find" \
										   "finding", "advice", "looking", "searching"];
			potential_need_keywords  	= potential_need_keywords.concat(request_keywords);
			// 4. Performance
			// Good, Great, Easy, Easier, worth, success, working, works, best, bad, tough, terrible, sucks, 
			let performance_keywords	= ["good", "great", "like", "easy", "easier", "worth", \
										   "success", "working", "best", "bad", "tough", "terrible", "sucks"];
			potential_need_keywords  	= potential_need_keywords.concat(performance_keywords);
            
            potential_need_keywords.forEach((keyword) => {
            	tweet_to_save.potential_need_score = tweet.full_text.indexOf(keyword) != -1 ? tweet_to_save.potential_need_score + 1 : tweet_to_save.potential_need_score;
            });

            return tweet_to_save;
			// 2. Followers Following bucket, has_link, is_retweet,
			// 3. Parse text and find a potential_need_score 

			// 4. Full contact Linkedin URL, Company Name, company url, company size
			// 5. contacted / following / replied ?
			// 6. Find others
		});	

		// Save tweets
		db.Tweet.bulkCreate(tweets_to_save)
		.then((saved_tweets) => { 
			
			
		})
		.catch((err) => {
			console.log("Nemam Amma Bhagavan Sharanam -- error", err);

		})
		.finally(() => {
			// Save tweet search query

			let tweet_actions_to_save = tweets_to_save.map((tweet) => {
				let tweet_action_to_save = {	
													status_id: 				tweet.status_id,
													keyword:  	 			search_query.keyword,
													screen_name: 			search_query.screen_name,
													read: 					'false',
													potential_need_score: 	tweet.potential_need_score
												}
				return tweet_action_to_save;								
			});
			console.log("Nemam Amma Bhagavan Sharanam -- saving tweet actions", tweet_actions_to_save);
			db.TweetAction.bulkCreate(tweet_actions_to_save)
			.then((saved_tweet_actions) => {
				// Update since_id
				db.SearchQuery.update({since_id: since_id}, {where: {screen_name: search_query.screen_name, keyword: search_query.keyword}});  
		    });      
		})


	}

	public static search_twitter(user, search_query) {
		return new Promise((resolve, reject) => {

			this.get_twitter_client(user.screen_name, "")
			.then(function(twitter_client) {
				
				//search_query.exclude_links = true;
				var next_since_id 		= search_query.since_id 		? search_query.since_id : "0";
				var exclude_retweets 	= search_query.exclude_retweets ? " exclude:retweets" : "";
				var exclude_links 		= search_query.exclude_links 	? " -filter:links" : "";
				var exclude_media		= search_query.exclude_media	? " -filter:media" : "";

				var twitter_query 		= search_query.keyword + exclude_retweets + exclude_links + exclude_media;
					//  Track tweet
					// var stream = twitter_client.stream('statuses/filter', {track: concated_keywords});
					// stream.on('data', function(tweet) {
					//if (twitter_query.match(/premium/)) {
				console.log("Nemam Amma Bhagavan Sharanam -- calling calling search tweets for ", twitter_query);

				twitter_client.get('search/tweets', {q:twitter_query , count: 100, result_type: "recent", since_id: next_since_id, tweet_mode: 'extended'}, function(error, data, response) {
				 	if (error) {
				 		console.log("Nemam Amma Bhagavan Sharanam -- error", error);
				 	}
				 	if (data["statuses"]){

					 	var tweets = data["statuses"];
					 	
						// Loop through each tweet if exists, get the search query and update it
						if (tweets.length > 0) {
							resolve(tweets);

							
						}
						else resolve([]);
					}
					else {
						resolve([]);
					}
				}); 			
	    	});
	    });	
	}
					

public static get_twitter_client(screen_name, concated_keywords) {
	return new Promise((resolve, reject) => {

		if (this.twitter_clients[screen_name]) resolve(this.twitter_clients[screen_name]);

		else 
		{
			console.log("Nemam Amma Bhagavan Sharanam -- setting up new client",);
			var oauth_credentials = {
										consumer_key: 			this.CONSUMER_KEY,
										consumer_secret: 		this.CONSUMER_SECRET,
										access_token_key: 		"",
										access_token_secret: 	"",
									 }
			// 0 Lookup access tokens
			db.User.findOne({where: {screen_name: screen_name}})
			.then((user) => {
				oauth_credentials.access_token_key  	= user.access_token_key;
				oauth_credentials.access_token_secret  	= user.access_token_secret;
				var twitter_client = new Twitter(oauth_credentials);

				// 2. update hash table
				this.twitter_clients[screen_name] = twitter_client;

				resolve(this.twitter_clients[screen_name])

			})
		}
			// 1 create twitter client 
	});


}  	

	public static round(value, step) {
	    step || (step = 1.0);
	    var inv = 1.0 / step;
	    return Math.round(value * inv) / inv;
	}

}
