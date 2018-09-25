import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class newSearchQueryService {
	added_search_query = new BehaviorSubject<SearchQuery>(undefined);

	constructor() {};

	emit_added_search_query(search_query: SearchQuery) {
		this.added_search_query.next(search_query);
	}
	

	
}