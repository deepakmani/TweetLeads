import { Http } from '@angular/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchQueryService {


  // Get list of search queries for current user
  constructor(private http: Http) {}

  get_search_queries(){
  	return this.http.get('/api/getSearchQueries').map(response => response.json());
  }
  
}