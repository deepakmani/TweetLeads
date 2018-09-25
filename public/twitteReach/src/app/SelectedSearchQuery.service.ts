import { Injectable, Inject, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { SearchQuery } from "./SearchQuery";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SelectedSearchQueryService {
	selected_search_query = new BehaviorSubject<SearchQuery>(undefined);

	constructor() {};

	emit_selected_search_query(search_query: SearchQuery) {
		this.selected_search_query.next(search_query);
	}
	

	
}