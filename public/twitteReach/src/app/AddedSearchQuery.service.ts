import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AddedSearchQueryService {
	added_search_query_observable = new BehaviorSubject<SearchQuery[]>([]);

	constructor() {};

	emit_added_search_query(search_queries: SearchQuery[]) {
		this.added_search_query_observable.next(search_queries);
	}
	
}