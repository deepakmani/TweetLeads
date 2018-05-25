export class TweetTemplate {
	constructor(
					// Required
					public screen_name: 		string,
					public category: 			string,
					public template_name: 		string,
					public text: 				string,

					// Unroll data
					public contacted?: 			boolean,
					public link_click?: 		boolean,
					public replied?: 			boolean,
					public selected?: 			boolean,
					public link?:				string

			){};


}