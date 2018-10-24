export class Tweet {
	constructor(
					// Required
					public status_id: 	string,
					public screen_name: string,
					public name: 		string,
					public text: 	boolean,

					// Not required

					public location?: 	string,
					public in_reply_to_status_id?: string,
					public retweeted_status_id?: 	string,

					// Unroll data
					public read?: 		boolean,	
					public contacted?: 	boolean,
					public link_click?: boolean,
					public replied?: 	boolean,
					public show_send_tweet?: 	boolean,
					public show_tweet_actions?: boolean

			){};


}