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

  get_tweets_by_search_query(search_query: SearchQuery):  Observable<Tweet[]> {
  	return this.http.get('/api/getTweetsBySearchQuery', {params: {screen_name: "DeepakABS", keyword: search_query.keyword }})
  	.map(response => response.json())
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
	


  	}
  }
