import * as db 			from '../models/db'
import * as Twitter 	from "twitter"
import * as Queue  		 from "bull"
import { SendTweet }	from "./send_tweet"
import { FollowUserWorker } from "./follow_user";

export class TwitterStreams {
	// 1. 
	static CONSUMER_KEY 		= "W4BsbvQJdEZtg27W0sAfAg";
 	static CONSUMER_SECRET 		= "3zbIFGQJv5QZyyWCGjUXiQzygnyV3P4YW3W3DFkpP0U";
 	static redis_url: String 	= process.env.REDIS_URL || "redis://h:p806e6846f9ab7ec0ebd98fd1053575781deef05c037e2bb583bf3ff363290485@ec2-54-81-19-119.compute-1.amazonaws.com:25849";
 	static MAX_FRIENDS 			= 5000;

	static 	twitter_clients = {}; 
	constructor() {
		// setup_twitter_search();
	}




	public static follow_users() {
			

		FollowUserWorker.auto_follow_users();
		this.find_users()
	        .then((users: Array<any>) => {


	      		// For each user
	      		// Collect earch search query and tokens

	      		users.map((user) => {

					this.auto_follow_tweet_user(user);
				});
	      	});
		setInterval(function() {
			this.find_users()
	        .then((users: Array<any>) => {


	      		// For each user
	      		// Collect earch search query and tokens

	      		users.map((user) => {

					this.auto_follow_tweet_user(user);
				});
	      	});
		}, 24 * 60 * 60 * 1000);
	}
	public static setup_twitter_search() {
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

	      					this.auto_search_twitter(user.screen_name, search_query)	      					
	      				}); 
	      			});					
	      		})
	      });
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

	      					this.auto_search_twitter(user.screen_name, search_query)	      					
	      				}); 
	      			});					
	      		})
	      })
		}, 5 * 60 * 1000);


		
	}

	public static auto_track_followers(user) {
  		// 1. 
	}

	// Store search queries for each user
	public static find_search_queries = (user) => {
		return new Promise(function(resolve, reject) {
			console.log("Nemam Amma Bhagavan Sharanam -- user", user);
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

		return new Promise((resolve, reject) => {
			var since_id 	   = search_query.since_id;
			let tweets_to_save = tweets.map((tweet) => {
	            since_id =   tweet.id_str > since_id  ? tweet.id_str : since_id;

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
									source: 					tweet.source,
									profile_description: 		tweet.user.description,
									profile_url: 				tweet.user.url,
									in_reply_to_status_id_str: 	tweet.in_reply_to_status_id_str,
									tweet_score: 				0
				} 

				// Rank profile scores
				// has_profile_link 		= 5
				if (tweet.user.url) tweet_to_save.tweet_score += 5;

				// has_profile_description 	= 4
				if (tweet.user.description) tweet_to_save.tweet_score += 4;

				// has_profile_age  		= 3
				if (tweet.user.age) 		tweet_to_save.tweet_score += 3;
				// is_known_source
				if (tweet.source.match(/twitter/i)) 	tweet_to_save.tweet_score += 5;
				// friends_followers_bucket
				tweet_to_save.tweet_score = (tweet.user.friends_count != 0 ? Number(this.round((tweet.user.followers_count / tweet.user.friends_count), .25) *  100) : 0) * 10;

				// Potential Need Scores
				let potential_need_keywords = {};

			 	let comparison_keywords 	= ["more", "most", "less", "least", "Better", \
			 							       "Many", "Much", "Difference", "prefer"];    
	        	potential_need_keywords["comparison_keywords"] = {
	        														keywords: comparison_keywords,
	        														weight:   10
	        													};
				// 2. Question
				// How, Which, What, Is (starting keyword), Does, why, can (starting)
				let question_keywords 		= ["how", "which", "what", "is", "does", "why", "where", "can", "has"];
				potential_need_keywords["question_keywords"] = {
																 keywords: question_keywords,
																 weight:   15
															   }	
				
				// 3. Request
				// Need, Decide, Decided, recommend, suggest,       
				let request_keywords   		= ["need", "tried", "try", "suggest", "suggestion", "recommend", "decide", "decided", "find" \
											   "finding", "advice", "looking", "searching"];
				potential_need_keywords["request_keywords"] = {
																keywords: request_keywords,
																weight:    25,
															  }	
				// 4. Performance
				// Good, Great, Easy, Easier, worth, success, working, works, best, bad, tough, terrible, sucks, 
				let performance_keywords	= ["good", "great", "like", "easy", "easier", "worth", \
											   "success", "working", "best", "bad", "tough", "terrible", "sucks"];
				
				potential_need_keywords["performance_keywords"] = { 
																		keywords: performance_keywords,
																		weight:   10
																	  }
	            

	            let potential_need_keyword_found = false;
	            Object.keys(potential_need_keywords).forEach((category) => {
	            	// 1. Loop through each keyword
	            	potential_need_keywords[category].keywords.forEach((keyword) => {
	            		let keyword_present 			= new RegExp(keyword, "i");
	            		let keyword_present_beginning  	= new RegExp("/^" + keyword + "/", "i");

	            		if (tweet_to_save.text.match(keyword_present_beginning))
	            		{	
	            			tweet_to_save.tweet_score 			= tweet_to_save.tweet_score + (potential_need_keywords[category].weight * 2);
	            			potential_need_keyword_found		= true;
	            		}
	            		else if (tweet_to_save.text.match(keyword_present)) {
	            			tweet_to_save.tweet_score = tweet_to_save.tweet_score + potential_need_keywords[category].weight;
	            			potential_need_keyword_found = true;
	            		}
	            	});
	            });


	            //if (search_query.search_potential_need_keywords && potential_need_keyword_found || !search_query.search_potential_need_keywords) 
	          		return tweet_to_save;
				// 2. Followers Following bucket, has_link, is_retweet,
				// 3. Parse text and find a potential_need_score 

				// 4. Full contact Linkedin URL, Company Name, company url, company size
				// 5. contacted / following / replied ?
				// 6. Find others
			});

			// Save tweets
			console.log("Nemam Amma Bhagavan Sharanam -- saving tweets", tweets_to_save);

			db.Tweet.bulkCreate(tweets_to_save)
			.then((saved_tweets) => { 
				resolve(saved_tweets);
			})
			.catch((err) => {
				// handle errors
				console.log("Nemam Amma Bhagavan Sharanam -- err", err);
				// if Error is some tweets are not saved
				//if ((err).match(/Primary Key Constraint/i))
				//	resolve(tweets_to_save)

				// If Error is db timeout etc
				//else 
					reject(err);		
			})
		});

	}

	public static auto_search_twitter(screen_name, search_query) {

		this.search_twitter(screen_name, search_query) 
		.then((tweets) => {
    		// Save Tweets to database
    		return this.save_tweets(tweets, search_query);

		})
		// Update Tweet Actions
		.then((saved_tweets) => {

			let tweet_actions_to_save = saved_tweets.map((tweet) => {
				let tweet_action_to_save = {	
													status_id: 				tweet.status_id,
													keyword:  	 			search_query.keyword,
													screen_name: 			search_query.screen_name,
													action: 				"new",
 													tweet_screen_name: 		tweet.screen_name
 										}
				return tweet_action_to_save;								
			});	
			return db["TweetAction"].bulkCreate(tweet_actions_to_save)
		})
		.then((saved_tweet_actions) => {

			// Update since_id after tweets are saved 
			if(saved_tweet_actions && saved_tweet_actions.length > 0) {
				db["SearchQuery"].update({since_id: saved_tweet_actions[0].status_id}, {where: {screen_name: search_query.screen_name, keyword: search_query.keyword}});  
			}
			
		})
		.then(() => {
           
		});

				
			  
	}

	public static search_twitter(screen_name, search_query) {
		return new Promise((resolve, reject) => {
			// get_twitter_client
			this.get_twitter_client(screen_name)
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
						console.log("Nemam Amma Bhagavan Sharanam -- running auto_search for: No Statuses", search_query.keyword);

						resolve([]);
					}
				}); 			
	    	});
	    });	
	}
					
/*
@name:  	get_twitter_client
@params: 	screen_name
@descr:		Check if twitter_client exists in twitter_clients hash if not create a new one
*/

public static get_twitter_client(screen_name) {

	return new Promise((resolve, reject) => {

		if (this.twitter_clients[screen_name]) resolve(this.twitter_clients[screen_name]);

		else 
		{
			console.log("Nemam Amma Bhagavan Sharanam -- Getting client for screen_name : ", screen_name);
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

public static auto_follow_tweet_user(user) {

		// 1. Setup queue				
		user.auto_follow_queue 			= Queue("follow_queue_" + user.screen_name
												, this.redis_url);
		// Graceful Shutdown
		process.once( 'SIGTERM', function ( sig ) {
		  user.auto_follow_queue.close().then(function () {
			   console.log('done')
		   });
		});

		// Listen for errors
		user.auto_follow_queue.on("error", function(err) {
			console.log("ABS -- Unable to create bull queue" + err);
		});

		this.follow_tweet_users(user);
		
} 

public static follow_tweet_users(user) {
	let tweet_users_to_follow;
	var to_follow_count;
	// 0. Select Users
	this.select_tweet_users_to_follow(user.screen_name)
	.then((data) => {

		tweet_users_to_follow = data;
	// 1. Check Number of friends for user
		return this.get_friends_count(user);
	})
	.then((friends_count) => {
		console.log("Nemam Amma Bhagavan Sharanam -- friends_count", friends_count);

		var to_follow_count = (this.MAX_FRIENDS - Number(friends_count)) > 1000 ?   1000 : this.MAX_FRIENDS - Number(friends_count);
	    
		
		// 2. Delete all jobs from queue
		
		// 3. Add to Follow Queue
       return user.auto_follow_queue.empty();
    })
    .then(() => {
    	 	console.log("Nemam Amma Bhagavan Sharanam -- adding jobs to queue", tweet_users_to_follow.slice(0, to_follow_count));
        	tweet_users_to_follow.slice(0, to_follow_count).forEach((tweet_user) => {
        	user.auto_follow_queue.add({
        		screen_name: 		user.screen_name,
        		tweet_screen_name: tweet_user.screen_name,
        		status_id: 			tweet_user.status_id,
        		keyword: 			tweet_user.keyword
        	});
    	});
	

	});
}
public static get_friends_count(user) {
	return new Promise((resolve, reject) => {
		// get_twitter_client
		this.get_twitter_client(user.screen_name)
		.then((twitter_client) => {
			twitter_client.get("users/show", {screen_name: user.screen_name},  function(error, data, response) {
			  if (!error) {
			  	resolve(data.friends_count);
			  }
			  else {
			  	reject();
			  }
			});
		})
	})
}

public static select_tweet_users_to_follow(screen_name: String) {
	return new Promise((resolve, reject) => {
		 db.sequelize.query(" SELECT * \
		 						FROM \
		 						(\"Tweets\" \
		 						 INNER JOIN \
		 						 (SELECT \"TweetActions\".keyword, \"TweetActions\".tweet_screen_name, \"TweetActions\".status_id FROM \
			 					      \"TweetActions\" \
		 						 INNER JOIN \
		 					 	 (SELECT keyword, screen_name  \
	 							 FROM \"SearchQueries\" \
	 							 WHERE screen_name='" + screen_name + "' \
	 							 AND auto_follow='true') as \"SearchQueries\" \
	 							 \
	 							 ON \"TweetActions\".keyword=\"SearchQueries\".keyword AND \
	 							 	\"TweetActions\".screen_name=\"SearchQueries\".screen_name \
	 							 	\
								WHERE  \"TweetActions\".status_id NOT IN (SELECT status_id \
											   FROM  \"TweetActions\" \
											   WHERE action='following' AND screen_name='" + screen_name + "')   	) as \"TweetActionsSearchQueries\"  \
								ON \"Tweets\".status_id=\"TweetActionsSearchQueries\".status_id ) as \"TweetsTweetActionsSearchQueries\" " +  
								"  ORDER BY tweet_score DESC"

	 					
			, { type: db.sequelize.QueryTypes.SELECT})
	    .then((tweet_users_to_follow) => {     		
	       		resolve(tweet_users_to_follow);
		});
	});
}

	
/*
	@name: markTweetsAsContacted
	@descr: 
	@input: tweet,
	*/

	public static markTweetsAsContacted = (tweets, user ) => {
		// Get List of tweets

		// For each tweet
		 db.sequelize.query("SELECT status_id  \
	 						 FROM \"Tweets\" \
	 						 WHERE status_id IN" +  mentions,
			 { type: db.sequelize.QueryTypes.SELECT})
	    .then((status_ids) => {
	    	
	    	db["TweetAction"].update (
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
	  	}); 
	}

	public static get_user_timeline(user) {

		return new Promise((resolve, reject) => {
			this.get_twitter_client(user.screen_name)
			.then(function(twitter_client) {
						
				twitter_client.get('statuses/user_timeline', {screen_name:user.screen_name, since_id: user.since_id}, function(error, tweets, response) {
				  if (!error) {
				    tweets.forEach
				  }
				});
			});
		});
	}
	public static round(value, step) {
	    step || (step = 1.0);
	    var inv = 1.0 / step;
	    return Math.round(value * inv) / inv;
	}

}
