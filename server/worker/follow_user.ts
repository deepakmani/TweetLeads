import * as db 			from '../models/db'
import * as Twitter 	from "twitter"
import * as Queue  		from "bull"
import {TwitterStreams} from './twitter_streams'

export class FollowUserWorker {

	static 	twitter_clients = {}; 

	// 1. For
	constructor() {}



	// 2. 
	public static auto_follow_users() {
		// 1. Lookup all users
		db["User"].findAll()
		.then((users) => {

			// 2. For Each User Create a Queue
			users.forEach((user) => {
					user.auto_follow_queue 			= Queue("follow_queue_" + user.screen_name
															, TwitterStreams.redis_url);
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

					FollowUserWorker.follow_user_processor(user.auto_follow_queue);

			})

		})



	}

	public static follow_user_processor(queue) {

		// 1. Follow user

		queue.process(function(job, done){
		// Processors can also return promises instead of using the done callback
			let screen_name 		= job.data.screen_name;
        	let	tweet_screen_name	= job.data.tweet_screen_name;
        	let	status_id 			= job.data.status_id;
		    let keyword  			= job.data.keyword;
             
         //  Follow User
         FollowUserWorker.get_twitter_client(screen_name)
		.then((twitter_client) => {
			twitter_client.post("friendships/create", {screen_name: tweet_screen_name}, function(error, data, response) {
			  if (!error) {
			  	// 2. If successful, add record with action Followed for all status ids with to_user
			  	db["TweetAction"].create({
			  		screen_name: 		screen_name,
			  		keyword: 			keyword,
			  		tweet_screen_name:  tweet_screen_name,
			  		status_id: 			status_id,
			  		action: 			"following"
			  	})
			  	.then(function(new_tweet_action) {
			  		console.log("Nemam Amma Bhagavan Sharanam -- added action ", new_tweet_action);
			  		// 3. Remove new record for all tweet_actions with tweet_user_name
			  		return db.sequelize.query(" DELETE FROM \"TweetActions\" \
			  			 					  WHERE  screen_name='" + screen_name + "' "  +
			  			 					  "AND 	 status_id='" 		+ status_id   + "' "  +
			  			 					  "AND 	 action='new'"

	 										, { type: db.sequelize.QueryTypes.SELECT})
	    		})
	    		.then((tweet_users_to_follow) => {     		
					
					  		// 4. Add Delay and call done
					  		setTimeout(function() {
					  			done();
					  		}, 60*1000);
			 	});


			  }			  
			  else {
			  	console.log("Nemam Amma Bhagavan Sharanam -- error", error);
			  }
			});
		})    

		

	});
 
 }

	 /*
	@name:  	get_twitter_client
	@params: 	screen_name
	@descr:		Check if twitter_client exists in twitter_clients hash if not create a new one
	*/

	public static get_twitter_client(screen_name) {
		console.log("Nemam Amma Bhagavan Sharanam -- Getting client for screen_name : ", screen_name);

		return new Promise((resolve, reject) => {

			if (this.twitter_clients[screen_name]) resolve(this.twitter_clients[screen_name]);

			else 
			{
				var oauth_credentials = {
											consumer_key: 			TwitterStreams.CONSUMER_KEY,
											consumer_secret: 		TwitterStreams.CONSUMER_SECRET,
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

}
