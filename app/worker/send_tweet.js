var db = require("../models/index.js");
var Q = require('q');
var Twitter 		= require('twitter');
var Q 				= require('q');
var CONSUMER_KEY 	= "0CATYOWT4xuugZNXZ1rDVXwBM";
var CONSUMER_SECRET = "mzG2At2kbbOPwdXRP4dhqZjqolghouVPGWjR6iI3E82HOeTEcg";
var twitter_clients = {};

module.exports =  function(queue, concurrency) {
  // call process
  queue.process(concurrency, function(job, done){
  		console.log("ABS -- Job", job);

  	//queue.getJob(job.jobId).then(function(job) {
  	//	console.log("ABS -- Job" + job.progress());

  		// Prevent multiple jobs from being run due to locking
  		// Issue: https://github.com/OptimalBits/bull/issues/210
  		if (job.progress() == 0) {
  			setTimeout(function() {
	  				send_tweet(job).then(function () {
					done(null, "");
				});
	  		}, 100000);
  		}
  	//})
  });
}

function send_tweet(job) {
	// job.data
	var keyword 				= job.data.keyword;
	var user  		 			= job.data.user;
	var	tweet_type 	   			= job.data.auto_tweet_type;
	var to_screen_name 			= job.data.to_screen_name;
	var to_name 				= job.data.to_name;
	var in_reply_to_status_id 	= tweet_type  == "Tweet Reply" ? job.data.in_reply_to_status_id : null;
	var template_name 			= job.data.template_name;
	var q 						= Q.defer();
	
	if (!user) 
		q.resolve();
 	else {
		var twitter_client;
		// 1. Check if already sent to user
		db.sentTweet.find({where: {screen_name: user.screen_name, to_screen_name: job.data.to_screen_name}})
		.then((sent_tweets) => {

			console.log("Nemam Amma Bhagavan Sharanam -- sent tweets to", to_screen_name,  sent_tweets, "twitter client", twitter_client);
			if (!sent_tweets) 
			{
				// 2. collect template_name

				get_twitter_client(user.screen_name, "")
				.then(function(data) {
					 twitter_client 		=  data.twitter_client;
					
					return db.tweetTemplate.find({where: {screen_name: user.screen_name, template_name: job.data.template_name}});
				})
				.then((tweet_template) => {

					var tweet = "@" + to_screen_name + " Hey " + to_name + ", " + tweet_template.text;

					// 4. send tweet
	                 twitter_client.post('statuses/update', {status: tweet, in_reply_to_status_id: in_reply_to_status_id},  function(error, tweet, response) {
					  if(error) console.log("Nemam Amma Bhagavan Sharanam -- error", error);
					  console.log(tweet);  // Tweet body.
					  console.log(response);  // Raw response object.

					  	// 5. update sentTweet
					  	db.sentTweet.create({
												screen_name: 	user.screen_name,
											    keyword: 		keyword,
											    status_id: 		tweet.id_str,
											    // Can be null, if its a tweet not a reply
											    in_reply_to_status_id: in_reply_to_status_id,
											    // cannot be null
											    to_screen_name:  to_screen_name,	
											    // Can be null
											    template_name:  template_name
				    						  }, { 
				    						  		where: { 
				    						  				screen_name: 	user.screen_name, 
				    						  				keyword: 		keyword
				    						  			}
				    						  	})
					  	.then((sent_tweet) => {

					  		console.log("Nemam Amma Bhagavan Sharanam -- sent tweet", tweet);
					  		q.resolve();
					  	});

					  	// 5. update sentTweet
					  	db.TweetAction.create({
												screen_name: 	user.screen_name,
											    status_id: 		tweet.id_str,
												action: 	 	[""] 		
					  						});
				    	
					});
	             });
				// 6. Call done

			}
		});
	}
	return q.promise;
}


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