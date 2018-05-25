import { Http } from '@angular/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { TweetTemplate } from './TweetTemplate';
import { SearchQuery } from './SearchQuery';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TweetTemplateService {


  // Get list of search queries for current user
  constructor(private http: Http) {}

  // Get Templates
  get_tweet_templates(): Observable<TweetTemplate[]> {
  	return this.http.get('/api/getTweetTemplates', {params: {screen_name: "DeepakABS"}})
  	.map(response => response.json());
  }
  // Save template and then set auto tweet to true
  save_tweet_template_search_query(tweet_template: TweetTemplate, search_query: SearchQuery):  Observable<Boolean> {
  	return this.http.post('/api/saveTweetTemplateSearchQuery', {tweet_template: tweet_template, search_query: search_query})
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
