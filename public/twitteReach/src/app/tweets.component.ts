import { Component, OnInit, OnDestroy, Input, Output} from '@angular/core';
 
import { TweetService } from "./tweet.service";
import { SearchQueryService } from "./searchQuery.service";
import { TweetTemplateService } from "./tweetTemplate.service";

import { SearchQueryDirective } from "./searchQuery.directive";

import { Tweet } from "./Tweet";
import { TweetTemplate } from "./TweetTemplate";

import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { SendTweetComponent } from './components/sendTweet.component';

import { ActivatedRoute } from '@angular/router';
import { MarkTweetAsReadDirective }  from "./directives/markTweetAsRead";


// Twitter Search Streams Route and Component
@Component({
   selector: 'tweets',
   template: `
  		<!-- SearchQueryComponent -->
  			<!-- <div class="mdl-button mdl-button--primary auto-tweet-btn" (click)="show_templates = true">
  				Auto Tweet
  				<br/>
  				<ui-switch disabled [(ngModel)]="enable_auto_tweet" size="small" labelOn="ON" labelOff="OFF"></ui-switch>
  			</div> -->
			<br/>
	   	
  		   	<templates [search_query]="search_query" (closeTweetTemplates)="close_templates($event)" *ngIf = "show_templates"> </templates>
    	 	<table class="tweets-table">
    	 		<tr>
    	 			<th [ngClass]="(active_action == 'New') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('New')"> New
    	 			<br/>
    	 			{{tweet_count.new}}
    	 			</th>
    	 			<th [ngClass]="(active_action == 'Contacted') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Contacted')">
    	 				Contacted
    	 				<br/>
    	 				{{tweet_count.contacted}} 
    	 			</th>
    	 			<th [ngClass]="(active_action == 'Replied') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Replied')">
    	 				Replied
    	 				<br/>
    	 				{{tweet_count.replied}} 
    	 			</th>
    	 			<th [ngClass]="(active_action == 'Read') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Read')">
    	 				Read
    	 				<br/>
    	 				{{tweet_count.read}} 
    	 			</th>
    	 		</tr>		


    	 		<tbody (mouseenter) ="tweet.show_tweet_actions = true"  (mouseleave) ="tweet.show_tweet_actions = false" style="cursor:pointer" *ngFor="let tweet of tweets">
    	 			<tr>
    	 				<td> 
    	 					<input type="checkbox">  <img src="{{ tweet.profile_img_url }}" style="margin-left:10px" />
    	 				</td> 
    	 				<td> 
    	 					{{ tweet.name }}
    	 					<br/>
    	 					<span style="font-size:10px"> @{{ tweet.screen_name }} </span>
    	 				</td> 
    	 				<td> 
    	 					{{ tweet.location }}
    	 				</td> 
    	 				<td>
    	 					
    	 				</td>
    	 			</tr>
    	 			<tr class="tweet-text-row" (click)="visit_tweet(tweet)">
    	 				<td colspan="4">
    	 					{{ tweet.text }}
    	 				</td>
    	 			</tr>
    	 			<tr> 
    	 				<td colspan="4">

    	 					<div style="float:right" *ngIf="tweet.show_tweet_actions">
		 						<button  (click)="visit_tweet(tweet)" class="mdl-button mdl-button--primary send-tweet-btn"  (click)="tweet.show_send_tweet = true"> 
		 							Send Tweet  
		 						</button>

		 						<button  (click)="visit_tweet(tweet)"  class="mdl-button mdl-button--primary" style="background:#32A; color:#FFF"  (click)="tweet.show_send_tweet = true"> 
		 							Follow User  
		 						</button>

		 						<button markTweetAsRead  [status_id]="tweet.status_id" (markTweetAsRead)="markTweetAsRead($event)" class="mdl-button mdl-button--primary mark-as-read-btn" style="background:#F2F2F2; color:#222"> 
		 							<input type="checkbox"/> Mark As Read  
		 						</button>

		 					</div>


		 					<!-- <send-tweet class="send-tweet" [tweet]='tweet' [search_query]='search_query' [tweetTemplates]='tweetTemplates' *ngIf="tweet.show_send_tweet"> </send-tweet>
		 					
		 					-->
    	 				</td>

    	 				
    	 			</tr>
    	 			<tr>
    	 				<td colspan="4" class="tweet-stats">
    	 				</td>
    	 			</tr>
    	 		</tbody>
    	 	</table>		
    	`
    ,
 providers: [
//   SearchQueryService
  ]
 })
export class TweetsComponent implements OnDestroy, OnInit  {
	 public search_query: 					SearchQuery;	
	 public tweets: 						Tweet[];
	 public tweetTemplates: 				TweetTemplate[];
	 public show_templates: 				boolean = false;
	 public active_action: 					string;
	 public new_count; 
	 public tweet_count 					= {
	 											new: 		0,
	 	                                        contacted: 	0,
	  								    		replied: 	0,
	  											follower: 	0,
	 											read: 		0,				
	 											saved: 		0
	 										}

	 public markTweetsAsRead: 				Array<string> = new Array<string>();

	 private _search_query: BehaviorSubject<SearchQuery> =  new BehaviorSubject<SearchQuery>(undefined);

	@Input() set selected_search_query(selected_search_query: SearchQuery) { 
	   	this._search_query.next(selected_search_query); 
	}

	get selected_search_query() {
	   return this._search_query.getValue();
	}

 
   	constructor(public TweetService: TweetService, public TweetTemplateService: TweetTemplateService, private route: ActivatedRoute, public SearchQueryService: SearchQueryService) {}
   	
   	markTweetAsRead = (status_id) => {
   		console.log("Nemam Amma Bhagavan Sharanam -- calling markTweetAsRead");
   		 this.markTweetsAsRead.push(status_id);
   		 
   		 // Update twitter streams count

   	}

   	visit_tweet(tweet) {
   		window.open("https://www.twitter.com/" + tweet.screen_name + "/status/" + tweet.status_id ,  "_blank");
 	}

    ngOnInit() {
    	// 1. Set active tweet type to New
    	this.active_action = "New";
	
        this.SearchQueryService.selected_search_query
        .subscribe((selected_search_query) => {
        	this.search_query = selected_search_query;
              
	        // Get tweets for the keyword
	        this.TweetService.getTweetCountBySearchQuery(this.search_query.keyword)
	        .subscribe(
	        	(data) => {
	        	this.tweet_count.new		 	= data.new_tweet_count;
	        	this.tweet_count.contacted 		= data.contacted_tweet_count;
	        	this.tweet_count.replied  	 	= data.replied_tweet_count;
	        	this.tweet_count.read 			= data.read_tweet_count;
	        });


	       let tweets_req = this.TweetService.getTweetsBySearchQueryAndActionType(this.search_query.keyword, this.active_action)
	        tweets_req.subscribe(tweets => {
	        	this.tweets = tweets.map((tweet) => {
	        						tweet.show_send_tweet = false;
					        		return tweet;
	        					})
					        	
	        }, 
	        err => {
	        })
	    })

        // Mark tweets as read when component doesnt get destroyed, but search query changes
 	    this.route
	      .queryParams
	      .subscribe(queryParams => {	
	      		if (this.markTweetsAsRead.length > 0) {
	      			this.TweetService.bulkMarkTweetsAsRead("DeepakABS", this.markTweetsAsRead)
			    	.subscribe((status) => {
			    		this.markTweetsAsRead = [];
			    	});
	      		}
	      });

	      // 
	      this.TweetTemplateService.get_tweet_templates()
	      .subscribe((tweet_templates) => {
	      	this.tweetTemplates = tweet_templates;
	      });
    }
    ngOnDestroy() {
    	// Invoke bulk read

    	console.log("Nemam Amma Bhagavan Sharanam -- calling mark tweets read inside ngDestroy");
    	if (this.markTweetsAsRead.length > 0) {
	    	this.TweetService.bulkMarkTweetsAsRead("DeepakABS", this.markTweetsAsRead)
	    	.subscribe((status) => {
	    		this.markTweetsAsRead = [];
	    	});
	    }

    }
    onChange(auto_tweet) {
    	this.show_templates = auto_tweet;
    }
 
 	close_templates($event) {
 		this.show_templates = false;
 	}		
  		
};