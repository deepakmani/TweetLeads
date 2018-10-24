import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators} from '@angular/forms';
import { Tweet } from "../Tweet"
import { SearchQuery } from "../SearchQuery"
import { TweetTemplate } from "../tweetTemplate"

import { TweetService } from "../tweet.service"

@Component({
		selector: 'send-tweet',
		templateUrl: '../templates/sendTweet.template.html'
})
export class SendTweetComponent {
	// Tweet to get screen_name, name - for personalization and status_id 
	@Input() tweet: Tweet;
	
	// search query to send keyword
	@Input() search_query: 			SearchQuery;
	@Input() tweetTemplates: 		TweetTemplate[];
	public tweetTemplate: 			TweetTemplate 	= undefined;
	public show_tweet_templates: 	Boolean 		= false;

	constructor(public TweetService: TweetService) {}


	sendTweetForm = new FormGroup ({
    							  // Req and must not be duplicate
   			                	  type: 	    new FormControl("Reply", Validators.required),
   			                	  // To screen_name
   			                	  // Required and max 240 characters, required, no links
   			                	  tweetText: 	new FormControl("", [Validators.required, Validators.maxLength(280)]),
  		                    });
	// Update tweetText when selectingTemplate

	// On submit 
	onSubmit() {
		// 0. Collect Form Model

		// 1. Collect template parameters
 		const formModel = this.sendTweetForm.value;
 		let   link  	= formModel.tweetText.match(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}/);
 			  link 		= link ? link[0] : null;

		// 1. Create text using to screen_name and template
		let tweetText 		= "@" + this.tweet.screen_name + " " + formModel.tweetText;
		//let templateName	= this.selectedTemplate ? selectedTemplate.
		// 2. Create send_tweet object	
		let send_tweet = {
							text:  	tweetText,
						    templateName: ""	
		}

		// 3. Call sendTweet service

		this.TweetService.sendTweet(this.search_query.keyword,
									this.tweet.name,
									formModel.type,
									this.tweet.screen_name,
									this.tweet.status_id,
									"DeepakABS",
									this.tweetTemplate ? this.tweetTemplate.template_name : "", 
									formModel.tweetText
									)
		.subscribe(() => {

		});


	}
	selectedTweetTemplate(tweetTemplate: TweetTemplate) {

		// Close tweet-templates
		this.show_tweet_templates = false;

		this.tweetTemplate  	  = tweetTemplate;

		// Apply tweet template to text
		this.sendTweetForm.patchValue({
		    tweetText: tweetTemplate.text
		});

	}

    
}