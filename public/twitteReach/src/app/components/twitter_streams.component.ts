import { Component, OnInit } from '@angular/core';
 
import { SearchQueryService } from "../searchQuery.service";
import { SearchQueryDirective } from "../searchQuery.directive";

import { SearchQuery } from "../SearchQuery";
import { Observable } from 'rxjs/Observable';
import { AddedSearchQueryService } from "../AddedSearchQuery.service"
import { SelectedSearchQueryService } from '../SelectedSearchQuery.service'



// Twitter Search Streams Route and Component
@Component({
   template: `
  		<!-- SearchQueryComponent -->
    	<div class="row">
				<div class="mdl-grid ">
					<div class="mdl-cell mdl-cell--3-col">
              <a  [routerLink]="['new_twitter_stream']" class="mdl-button mdl-button--primary add-search-query-button">
                  Add New Search Query
              </a>
              <table class="search-query-table" style="width: 100%">
                <tbody *ngFor="let category of objectKeys(search_query_by_category)">
                   
                     <tr>
                        <td colspan='2' class="search-query-category"> {{ category }} </td>
                     
                    </tr>

                    <tr highlightSearchQuery (click) = "selectSearchQuery(search_query)" [routerLink]="['tweets']"  [queryParams]="{ keyword: search_query.keyword}" class="search-query-keyword"  *ngFor="let search_query of search_query_by_category[category]">
                      <td>
                        {{ search_query.keyword }}
                      </td>
                      <td> {{ search_query.new_tweets_count }} </td>
                     </tr>
                    </tbody>
              </table>
               
         	 	</div>

              <!-- AddSearchQueryComponent -->

            <div class="mdl-cell mdl-cell--8-col">
                 <router-outlet></router-outlet>
            </div>
            
           
       </div> 	
    </div> 
        
        
        `
,
 providers: [
   SelectedSearchQueryService, AddedSearchQueryService
  ]})

export class TwitterStreamsComponent implements OnInit  {
	 
	private search_queries:SearchQuery[]         = [];
  private errorMessage:any                     = '';
  private show_add_search_query:boolean        = false;
  public search_query_by_category:any         = {};
  private selected_search_query:SearchQuery    = undefined;
  private show_sub_component                   = "tweets";
  public  objectKeys                           = Object.keys; 
 constructor(public SearchQueryService: SearchQueryService, public SelectedSearchQueryService: SelectedSearchQueryService, public AddedSearchQueryService: AddedSearchQueryService) { 
   

 }
 added_search_queries() {
   // 1. Look for category
   

 }
 selectSearchQuery(searchQuery) {
   this.selected_search_query = searchQuery;
   this.SearchQueryService.emit_selected_search_query(this.selected_search_query);

 }
  ngOnInit(){
       this.AddedSearchQueryService.added_search_query_observable.subscribe(
         (added_search_queries) => {
           added_search_queries.forEach((added_search_query, index) => {
     
              // Check if category exists
              if (this.search_query_by_category[added_search_query.category] == undefined) {
                // Add category
                this.search_query_by_category[added_search_query.category] = new Array<SearchQuery>(added_search_query);
              }
              else { 
                // Update array of search_queries
                let search_queries = this.search_query_by_category[added_search_query.category];
                search_queries.unshift(added_search_query);
              
                this.search_query_by_category[added_search_query.category]  = search_queries;
              }
       });
    });
  

       this.SearchQueryService.get_search_queries()
       .subscribe(
                (search_queries : Array<SearchQuery>) => {
                  this.search_queries = search_queries;
                  this.selected_search_query = search_queries.length > 0 ? search_queries[0] : null;
                  
                  this.SearchQueryService.emit_selected_search_query(this.selected_search_query);
                  this.search_queries.forEach((search_query, index) => {
                    if (search_query.category == "") return;
                    if (!search_query.template_names) search_query.template_names = [];
                     console.log("Nemam Amma Bhagavan Sharanam -- search_queries", this.search_query_by_category);
   
                    // Check if category exists
                    if (!(search_query.category in this.search_query_by_category)) {
                      // Add category
                      console.log("Nemam Amma Bhagavan Sharanam -- new category", search_query.category)
                      this.search_query_by_category[search_query.category] = new Array<SearchQuery>(search_query);
                    }
                    else { 
                      // Update array of search_queries
                      let search_queries: Array<SearchQuery> = this.search_query_by_category[search_query.category];
                      search_queries.push(search_query);
                      this.search_query_by_category[search_query.category]  = search_queries;
                    }

                })
                }
                  ,
                
                error => this.errorMessage = <any>error
      );
  }
}



