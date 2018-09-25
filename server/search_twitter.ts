import * as db from '../models/db'

class SearchTwitter {
	// 1. 
	static  CONSUMER_SECRET = '';
	static  CONSUMER_KEY =  	'';

	constructor() {}

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
      					search_twitter(search_query)
      					// 2. Add to tweets model, tweetsearchquery model
      					// 3. s

      				}); 
      			});
      		})
      })
	}
	// Store search queries for each user
	public static find_search_queries = (user) => {
		return new Promise(function(resolve, reject) {
			db.SearchQuery.findAll({where: {screen_name: user.screen_name}})
			.then((search_queries) => {
				resolve(search_queries);
			});
			
		});
	})

	public static find_users() {

		return new Promise(function(resolve, reject) {  
			db.User.findAll()
				.then(function(users) {
					resolve(users);
				});
		});		
	}	
}