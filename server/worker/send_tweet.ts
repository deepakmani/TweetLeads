import * as db from "../models/db"

import * as Twitter from "twitter"

export class SendTweet {
	
	public CONSUMER_KEY 	= "0CATYOWT4xuugZNXZ1rDVXwBM";
	public CONSUMER_SECRET  = "mzG2At2kbbOPwdXRP4dhqZjqolghouVPGWjR6iI3E82HOeTEcg";
	

	public 	twitter_client;
	constructor(queue, concurrency) {
		// setup_twitter_search();
		this.process_queue(queue, concurrency)
	}



	/* 
	@name:	 start_queue
	@descr:  process the queue
	*/
 	public process_queue = (queue, concurrency) => {
	  // call process
	  queue.process(concurrency, (job, done) => {
	  		console.log("ABS -- Job", job);

	  		if (job.progress() == 0) {
	  			setTimeout(() => {
		  				this.send_tweet(job).then(() => {
						done(null, "");
					});
		  		}, 100000);
	  		}
  		});
	}
	
	/*
	@name: 	send_tweet
	@params:  
	*/  
	public send_tweet(job) {
		// 1. Get credentials
		// 2. 	
       	var keyword 				= job.data.keyword;
		var screen_name  		 	= job.data.screen_name;
		var	tweet_type 	   			= job.data.type;
		var to_screen_name 			= job.data.to_screen_name;
		var to_name 				= job.data.to_name;
		var in_reply_to_status_id 	= job.data.in_reply_to_status_id;
		var template_name 			= job.data.template_name;
		var tweetText 				= job.data.tweetText;
		
		var twitter_client;
		
		// 1. Check if already sent to user
		return new Promise((resolve, reject) => {
			db["sentTweet"].find({where: {screen_name: screen_name, to_screen_name: job.data.to_screen_name}})
		.then((sent_tweets) => {

			console.log("Nemam Amma Bhagavan Sharanam -- sent tweets to", to_screen_name,  sent_tweets, "twitter client", twitter_client);
			if (!sent_tweets) 
			{
				// 2. collect template_name

				this.get_twitter_client(screen_name)
				.then(function(data) {
					 twitter_client 		=  data;
					
				// 	return db["tweetTemplate"].find({where: {screen_name: user.screen_name, template_name: job.data.template_name}});
				// })
				// .then((tweet_template) => {

					var tweet = "@" + to_screen_name + " " + tweetText;
					//" Hey " + to_name + ", " 
					 

					// 4. send tweet
	                 twitter_client.post('statuses/update', {status: tweet, in_reply_to_status_id: (tweet_type == "Reply") ?  in_reply_to_status_id : ""},  function(error, tweet, response) {
					  if(error) console.log("Nemam Amma Bhagavan Sharanam -- error", error);
					  console.log(tweet);  // Tweet body.
					  console.log(response);  // Raw response object.

					  	// 5. update sentTweet
					  	db.sentTweet.create({
												screen_name: 	screen_name,
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
				    						  				screen_name: 	screen_name, 
				    						  				keyword: 		keyword
				    						  			}
				    						  	})
					  	.then((sent_tweet) => {

					  		console.log("Nemam Amma Bhagavan Sharanam -- sent tweet", tweet);
					  		resolve();
					  	}); // Update sentTweet

					  	// 5. update sentTweet
					  	db.TweetAction.update({
												screen_name: 			screen_name,
											    status_id: 				in_reply_to_status_id,
												contacted_or_replied: 	'false',
												read: 					'true'		
					  						});
				    	
					}); // Tweet
	             });
				// 6. Call done

			}
		});
	});

	}

	/*
@name:  	get_twitter_client
@params: 	screen_name
@descr:		Check if twitter_client exists in twitter_clients hash if not create a new one
*/

public get_twitter_client(screen_name) {
	return new Promise((resolve, reject) => {

		if (this.twitter_client) resolve(this.twitter_client);

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
				this.twitter_client = twitter_client;

				resolve(this.twitter_client)

			})
		}
			// 1 create twitter client 
	});


}  	
}