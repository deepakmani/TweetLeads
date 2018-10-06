import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators} from '@angular/forms';
import { Tweet } from "../Tweet"
@Component({
		selector: 'send-tweet',
		templateUrl: '../templates/sendTweet.template.html'
})
export class SendTweetComponent {
	// Tweet to get screen_name, name - for personalization and status_id 
	@Input() tweet: Tweet;
	
	// search query to send keyword
	@Input() search_query: SearchQuery;

	sendTweetForm = new FormGroup ({
    							  // Req and must not be duplicate
   			                	  type: 	    new FormControl("Reply", Validators.required),
   			                	  // To screen_name
   			                	  // Required and max 240 characters, required, no links
   			                	  tweetText: 	new FormControl("", [Validators.required, Validators.maxLength(280)]),
  		                    });
	//  
    
}