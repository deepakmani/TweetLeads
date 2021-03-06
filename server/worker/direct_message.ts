import * as db 			from '../models/db'
import * as Twitter 	from "twitter"
import * as Queue  		from "bull"
import {TwitterStreams} from './twitter_streams'

export class DirectMessageWorker {

	static 	twitter_clients = {}; 

	// 1. For
	constructor() {}


	// 2. 
	public static send_direct_message() {
		// 1. Lookup all users
		db["User"].findAll()
		.then((users) => {

			// 2. For Each User Create a Queue
			users.forEach((user) => {
					user.direct_message_queue 			= Queue("direct_message_queue" + user.screen_name
															, TwitterStreams.redis_url);
					// Graceful Shutdown
					process.once( 'SIGTERM', function ( sig ) {
					  user.direct_message_queue.close().then(function () {
						   console.log('done')
					   });
					});

					// Listen for errors
					user.direct_message_queue.on("error", function(err) {
						console.log("ABS -- Unable to create bull queue" + err);
					});

					DirectMessageWorker.send_direct_message_process(user.direct_message_queue);

			});

		});



	}

	public static send_direct_message_process(queue) {

		// 1. Follow user

		queue.process(function(job, done){
			// Processors can also return promises instead of using the done callback
			let screen_name 		= job.data.screen_name;
        	let	tweet_screen_name	= job.data.tweet_screen_name;
        	let template_name 		= job.data.template_name;
        	let dm_event 			= {"event": 
        								{"type": "message_create", 
        								 "message_create": { 
        								 					 "target": {
        								 						
        								 								"recipient_id": "RECIPIENT_USER_ID", 
        								 						 		"message_data": {"text": "Hello World!"}
        								 				 			 	}
        								 	}

        								 }
        							 }

             
         