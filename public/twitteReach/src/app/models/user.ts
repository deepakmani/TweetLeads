export class User {
	constructor (
		public screen_name: 	String,
		public name: 			String,
		public profile_img_url: String,
		public location?:	 	String,
		public age?: 			Number)

        {}
}

// Note const is needed for exporting
export const DefaultUser = new User("DeepakABS",
									"Deepak Mani", 
                              		"https://pbs.twimg.com/profile_images/610489407951364097/P4kSPa0G_400x400.jpg") 
                              		
