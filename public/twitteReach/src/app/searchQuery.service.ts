import { Http } from '@angular/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { SearchQuery } from './SearchQuery';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SearchQueryService {
  selected_search_query = new BehaviorSubject<SearchQuery>(undefined);


  // Get list of search queries for current user
  constructor(private http: Http) {}

  get_search_queries():  Observable<SearchQuery[]> {
  	return this.http.get('/api/getSearchQueries', {params: {screen_name: "DeepakABS"}})
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


	
  	 add_search_queries(new_search_queries: SearchQuery[]) {
  		return this.http.post('/api/addNewSearchQueries', {new_search_queries: new_search_queries})
  		.map(response => response.json())
  	}

  	emit_selected_search_query(search_query: SearchQuery) {
		this.selected_search_query.next(search_query);
	}
  }
 