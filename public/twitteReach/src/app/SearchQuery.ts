export class SearchQuery {
	constructor(
					// Required
					public keyword: 			string,
					public screen_name: 		string,
					public category: 			string,
					public type?: 				string,

					// Not required
					public locations?: 			string[],
					public exclude_retweets?: 	boolean,
					public exclude_media?: 		boolean,
					public exclude_links?: 		boolean,
					public exclude_bots?:		boolean,
					public exclude_keywords?: 	string[],
					public auto_tweet_type?: 	string,
					public template_names?: 	string[],
					public auto_follow?: 		boolean,
					public search_potential_need_keywords?: boolean,
					public tweet_count?: 	 Number,
					public added?: 			boolean	
			){};


}