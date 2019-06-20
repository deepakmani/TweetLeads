import { Http } from '@angular/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Tweet } from './Tweet';
import { SearchQuery } from './SearchQuery';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TweetService {


  // Get list of search queries for current user
  constructor(private http: Http) {}

  getTweetCountBySearchQuery = (keyword) => {
  	 return this.http.get('/api/getTweetCountBySearchQuery', {params: {screen_name: "DeepakABS", keyword: keyword }})
  	.map(response => response.json())
  };
  getTweetsBySearchQueryAndActionType = (keyword: string, action: string) => {
  	return this.http.get('/api/getTweetsBySearchQueryAndActionType', {params: {screen_name: "DeepakABS", keyword: keyword, action: action }})
  	.map(response => response.json())
  }
	// .map((search_query) => new SearchQuery(search_query.keyword, 
 //                                      	search_query.screen_name,
 //                                      	search_query.category ?  search_query.category : "Default",
	//                                       search_query.type,
	//                                       search_query.locations,
	//                                       search_query.exclude_retweets,
	//                                       search_query.exclude_media,
	//                                       search_query.exclude_links,
	//                                       search_query.exclude_bots,
	//                                       search_query.exclude_keywords,
	//                                     search_query.enable_auto_tweet,
	// 	                                search_query.tweet_count)
	
	bulkMarkTweetsAsRead = (screen_name: string, status_ids: Array<string>) => {
		return this.http.post('/api/bulkMarkTweetsAsRead', {screen_name: "DeepakABS", status_ids: status_ids});
	}
	sendTweet = (keyword: String, to_name: String, type: String, to_screen_name: String, in_reply_to_status_id: String,
				 screen_name: String, template_name: String, tweetText: String) => {

	 return this.http.post('/api/sendTweet', {
	 									keyword: keyword, 
	 								  	to_name: to_name,
	 								  	type: 	  type,
	 								  	to_screen_name: to_screen_name,
	 								  	in_reply_to_status_id: in_reply_to_status_id,
	 								  	screen_name: screen_name,
	 								  	template_name: template_name,
	 								  	tweetText: 		tweetText
	 								 });

	}

	searchTwitter = (search_query: SearchQuery, screen_name: String) => {

		return this.http.get("/api/search_twitter", {params: {
																search_query: search_query,
																screen_name:  screen_name
															}
													})
							 .map(response => response.json())
	}

  
  }
