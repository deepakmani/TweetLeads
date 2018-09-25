import { Component, OnInit, Input, Output} from '@angular/core';
 
import { TweetService } from "./tweet.service";
import { SelectedSearchQueryService } from "./SelectedSearchQuery.service";

import { SearchQueryDirective } from "./searchQuery.directive";

import { Tweet } from "./Tweet";
import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { MarkTweetAsReadDirective }  from "./directives/markTweetAsRead";

// Twitter Search Streams Route and Component
@Component({
   selector: 'tweets',
   template: `
  		<!-- SearchQueryComponent -->
  			<div class="mdl-button mdl-button--primary auto-tweet-btn" (click)="show_templates = true">
  				Auto Tweet
  				<br/>
  				<ui-switch disabled [(ngModel)]="enable_auto_tweet" size="small" labelOn="ON" labelOff="OFF"></ui-switch>
  			</div>
			<br/>
	   	
  		   	<templates [search_query]="search_query" (closeTweetTemplates)="close_templates($event)" *ngIf = "show_templates"> </templates>
    	 	<table class="tweets-table">
    	 		<tr>
    	 			<th [ngClass]="(active_tweet_type == 'New') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('New')"> New
    	 			<br/>
    	 			{{new_count}}
    	 			</th>
    	 			<th [ngClass]="(active_tweet_type == 'Contacted') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Contacted')">
    	 				Contacted
    	 				<br/>
    	 				{{contacted_count}} 
    	 			</th>
    	 			<th [ngClass]="(active_tweet_type == 'Replied') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Replied')">
    	 				Replied
    	 				<br/>
    	 				{{replied_count}} 
    	 			</th>
    	 			<th [ngClass]="(active_tweet_type == 'Read') ? 'active-tweet-type':'inactive-tweet-type'" (click)="get_tweets('Read')">
    	 				Read
    	 				<br/>
    	 				{{read_count}} 
    	 			</th>
    	 		</tr>		


    	 		<tbody *ngFor="let tweet of tweets">
    	 			<tr markTweetAsRead [status_id]="tweet.status_id" (markTweetAsRead)="markTweetAsRead($event)">
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
    	 			</tr>
    	 			<tr class="tweet-text-row">
    	 				<td colspan="4">
    	 					{{ tweet.text }}
    	 				</td>
    	 			</tr>
    	 			<tr >
    	 				<td colspan="4" class="tweet-stats">
    	 				</td>
    	 			</tr>
    	 		</tbody>
    	 	</table>		
    	`
    ,
 providers: [
   SelectedSearchQueryService
  ]
 })
export class TweetsComponent {
	 public search_query: 					SearchQuery;	
	 public tweets: 						Tweet[];
	 public show_templates: 				boolean = false;
	 public active_action: 					string;
	 public new_count; 
	 public contacted_count; 
	 public replied_count; 
	 public followed_count; 
	 public favorited_count; 
	 public saved_count; 
	 public read_count;
	 public markTweetsAsRead: 				Array<any>;

	 private _search_query: BehaviorSubject<SearchQuery> =  new BehaviorSubject<SearchQuery>(undefined);

	@Input() set selected_search_query(selected_search_query: SearchQuery) { 
	   	this._search_query.next(selected_search_query); 
	}

	get selected_search_query() {
	   return this._search_query.getValue();
	}

 
   	constructor(public TweetService: TweetService, private route: ActivatedRoute) {}
   	
   	markTweetAsRead = (status_id) => {
   		let tweet_action_pkey = {status_id: status_id, screen_name: 'DeepakABS', keyword: this.search_query.keyword};
   		console.log("Nemam Amma Bhagavan Sharanam -- calling markTweetAsRead");
   		 this.markTweetsAsRead.push(tweet_action_pkey);
   	}
    ngOnInit() {
    	// 1. Set active tweet type to New
    	this.active_action = "New";
    	this.route.queryParams
	      .subscribe(params => {
	        let keyword  = params.keyword;
	        // Get tweets for the keyword
	        this.TweetService.getTweetCountBySearchQuery(keyword)
	        .subscribe(data => {
	        	this.new_count		 = data.new_count;
	        	this.contacted_count = data.contacted_count;
	        	data.replied_count   = data.replied_count;
	        });

	       let tweets_req = this.TweetService.getTweetsBySearchQueryAndActionType(keyword, this.active_action)
	        tweets_req.subscribe(tweets => {
	        	this.tweets = tweets;
	        }, 
	        err => {
	        })
	    });
    }
    onChange(auto_tweet) {
    	this.show_templates = auto_tweet;
    }
 
 	close_templates($event) {
 		this.show_templates = false;
 	}		
  		
};