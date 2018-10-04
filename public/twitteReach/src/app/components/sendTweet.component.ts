import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators} from '@angular/forms';

@Component({
		selector: 'send-tweet',
		templateUrl: '../templates/sendTweet.template.html'
})
export class SendTweetComponent {
	
	sendTweetForm = new FormGroup ({
    							  // Req and must not be duplicate
   			                	  type: 	new FormControl("Reply", Validators.required),
   			                	  // Required and max 120 characters
   			                	  tweetText: 	new FormControl("", [Validators.required, Validators.maxLength(280)]),
  		                    });
    
}