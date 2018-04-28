export class SearchQuery {
	constructor(
					// Required
					public keyword: 	string,
					public screen_name: string,
					public category: 			string,
					public type: 				string,

					// Not required
					public locations?: 		string[],
					public exclude_retweets?: 	boolean,
					public exclude_media?: 	boolean,
					public exclude_links?: 	boolean,
					public exclude_bots?:		boolean,
					public exclude_keywords?: 	string[],
					public enable_auto_tweet?: string,
					public auto_tweet_template_name?: string,
					public tweet_count?: string,
					public added?: 		boolean	
			){};


}