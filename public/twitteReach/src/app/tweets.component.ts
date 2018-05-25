import { Component, OnInit, Input, Output} from '@angular/core';
 
import { TweetService } from "./tweet.service";
import { SearchQueryDirective } from "./searchQuery.directive";

import { Tweet } from "./Tweet";
import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
 

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
    	 		<tbody *ngFor="let tweet of tweets">
    	 			<tr>
    	 				<td> 
    	 					<input type="checkbox"> 
    	 				</td>
    	 				<td> 
    	 					<img src="{{ tweet.profile_img_url }}" />
    	 				</td> 
    	 				<td> 
    	 					{{ tweet.name }}
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
    })
export class TweetsComponent {
	 public search_query: 					SearchQuery;	
	 public tweets: 						Tweet[];
	 public show_templates: 				boolean = false;

	 private _search_query: BehaviorSubject<SearchQuery> =  new BehaviorSubject<SearchQuery>(undefined);

	@Input() set selected_search_query(selected_search_query: SearchQuery) { 
	   	this._search_query.next(selected_search_query); 
	}

	get selected_search_query() {
	   return this._search_query.getValue();
	}

 
   	constructor(public TweetService: TweetService) {}

    ngOnInit() {
    	this._search_query.subscribe(search_query => {
	       if (search_query) 
	       	{
	       			this.search_query = search_query;
				  
			    	this.TweetService.get_tweets_by_search_query(this.search_query)
			    	.subscribe((
			    		tweets => {
			    			this.tweets = tweets;
			    	}))
			}
	   })
    }
    onChange(auto_tweet) {
    	this.show_templates = auto_tweet;
    }
 
 	close_templates($event) {
 		this.show_templates = false;
 	}		
  		
};