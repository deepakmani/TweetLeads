let Twitter = require('Twitter');
let db 		= require('./dist/models/db.js');

let user = {}; user.screen_name = "deepakabs";

get_recent_followers(user)
.then((recent_followers) => {
	return select_templates_to_auto_dm(user, recent_followers)
})
.then((tweet_templates_tweet_screen_names) => {
	update_tweets_as_followers(user, recent_followers);

	tweet_templates_tweet_screen_names.forEach((tweet_templates_tweet_screen_name, i) => {
		// 1. Get template
		let template_name = tweet_templates_tweet_screen_name.template_names[Date.now() % tweet_templates_tweet_screen_names.template_name.length]	


		// 2. Search template 
	    let tweet_user 	 =  tweet_templates_tweet_screen_name.tweet_screen_name;


	    user.direct_message_queue.add({
        		screen_name: 		user.screen_name,
        		tweet_screen_name:  tweet_screen_name,
        		template_name: 		template_name
       	});

	}); 
 
}


function get_recent_followers(user) {

	let screen_name = user.screen_name;

	return new Promise((resolve, reject) => {
		params = {screen_name: screen_name, count: 200};
		
		// get_twitter_client
		var twitter_client = new Twitter({	
										  consumer_key: 	   "W4BsbvQJdEZtg27W0sAfAg",
										  consumer_secret: 	   "3zbIFGQJv5QZyyWCGjUXiQzygnyV3P4YW3W3DFkpP0U",
										  access_token_key:    "1724608555-R3MbqVjAatPIRFC3THNglH3BLOfO6MAjHlUW8nB", // user.access_token_key,
										  access_token_secret: "IliBzpicbMOwo6BFVcOOxul3jUzDTE3nwPGqdSJFqybra" // user.access_token_secret
										});
		
		twitter_client.get("followers/list", params, function(error, data, response) {
		 


		  // 1. For each follower check if exists in recent_followers_array
		  if (!error) {
		    console.log("Nemam Amma Bhagavan Sharanam -- response", data);
		  
			  // 2. Collect all followers not in recent_followers array
			  let recent_followers = "(";	
			  data.forEach((screen_name) => {
			  	//
			  	recent_followers += screen_name + " ";

			  });
			  recent_followers += ")";
			  resolve(recent_followers)
			}
			else {
				resolve("");
			}
		});
	});
}	

 // 3. Check if follower is in TweetActions table
function update_tweets_as_followers(user, recent_followers) {
	return db.sequelize.query("UPDATE \"TweetActions\" \
		 								   SET action='follower'" \
		 								   "tweet_screen_name IN " + recent_followers +
		 								   "WHERE action='following' \
		 								   AND screen_name='" + user.screen_name + "'")
		 
}

function select_templates(user, recent_followers) {
		 		// Set Status to followers	
		 		return  db.sequelize.query("SELECT DISTINCT(tweet_screen_name) as tweet_screen_name, template_names \
		 									FROM \ 
		 									(	\"SearchQueries\" INNER JOIN \
		 										(SELECT tweet_screen_name, keyword \
							  					 FROM \
												\"TweetActions\" \
												WHERE tweet_screen_name IN " + recent_followers + 
												"WHERE action ='following'" +
												"AND screen_name ='" + user.screen_name + "' ) Using(keyword) as SearchQueriesFollower) \
											WHERE screen_name='" + user.screen_name + "' \
											AND template_names !='{}'"
						  , { type: db.sequelize.QueryTypes.SELECT})
}


function send_direct_message(screen_name, template_name, tweet_screen_name) {
	// 1. 


	// 2. 

}

function update_to_follower(tweet_actions) {
	return new Promise((resolve, reject) => {
		resolve();
	});
}
