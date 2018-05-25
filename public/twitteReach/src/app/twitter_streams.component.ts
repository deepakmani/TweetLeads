import { Component, OnInit } from '@angular/core';
 
import { SearchQueryService } from "./searchQuery.service";
import { SearchQueryDirective } from "./searchQuery.directive";

import { SearchQuery } from "./SearchQuery";
import { Observable } from 'rxjs/Observable';


// Twitter Search Streams Route and Component
@Component({
   template: `
  		<!-- SearchQueryComponent -->
    	<div class="row">
				<div class="mdl-grid ">
					<div class="mdl-cell mdl-cell--3-col">
              <div class="mdl-button mdl-button--primary add-search-query-button"  (click)="show_sub_component = 'add_search_query'">
                  Add New Search Query
              </div>
              <table class="search-query-table" style="width: 100%">
                <tbody *ngFor="let category of search_query_by_category">
                   
                     <tr >
                        <td colspan='2' class="search-query-category"> {{ category.name }} </td>
                     
                    </tr>
                    <tr highlightSearchQuery  class="search-query-keyword"  *ngFor="let search_query of category.search_queries">
                      <td (click)="selectSearchQuery(search_query)"> {{ search_query.keyword }} </td>
                      <td (click)="selectSearchQuery(search_query)"> {{ search_query.tweet_count }} </td>
                     </tr>
                    </tbody>
              </table>
               
         	 	</div>

              <!-- AddSearchQueryComponent -->

            <div class="mdl-cell mdl-cell--8-col" *ngIf="show_sub_component == 'add_search_query'; else tweetsTemplate">
                <add-search-query [search_queries]="search_queries" (added_search_queries) = "added_search_queries($event)" *ngIf="show_sub_component == 'add_search_query'"> </add-search-query>

            </div>
            
            <ng-template #tweetsTemplate>
                <tweets [selected_search_query]="selected_search_query" class="mdl-cell mdl-cell--8-col"> </tweets>
            </ng-template>
       </div> 	
    </div> 
        
        
        `
,
 providers: [
  // SearchQueryService
  ]})

export class TwitterStreamsComponent implements OnInit  {
	 
	private search_queries:SearchQuery[]         = [];
  private errorMessage:any                     = '';
  private show_add_search_query:boolean        = false;
  private search_query_by_category:any         = [];
  private selected_search_query:SearchQuery    = undefined;
  private show_sub_component                   = "tweets";

 constructor(public SearchQueryService: SearchQueryService) { 
   

 }
 added_search_queries(added_search_queries: SearchQuery[]) {
   // 1. Look for category
   added_search_queries.forEach((added_search_query, index) => {
     
     let category_present: boolean = false;
     this.search_query_by_category.forEach((val, index) => {

       // 2. Check if matches
       if (val.name == added_search_query.category) {
         // 3. unshift the search query in search_query_by_category
         this.search_query_by_category[index].search_queries.unshift(added_search_query);
         category_present = true;
       }
     })
     // If category is new
     if (!category_present) {
       // unshift category and search query
       this.search_query_by_category.unshift({name:           added_search_query.category, 
                                              search_queries: [added_search_query]
                                            });
     }
   });

 }
 selectSearchQuery(searchQuery) {
   this.selected_search_query = searchQuery;
 }
  ngOnInit(){

       this.SearchQueryService.get_search_queries()
       .subscribe(
                search_queries => {
                  this.search_queries = search_queries;
                  let category_index     = -1;
                  let prev_search_query_category: string  = undefined;

                  this.selected_search_query = search_queries.length > 0 ? search_queries[0] : null;

                  this.search_queries.forEach((search_query, index) => {
                    console.log("Nemam Amma Bhagavan Sharanam -- current_category", search_query.category, " prev category", prev_search_query_category, " index", index);
                    if (search_query.category == "") return;
                    if (!search_query.template_names) search_query.template_names = [];
 
                    // Move to next category
                    if ((search_query.category != prev_search_query_category) || index == 0) {
                    
                      // Create new array
                      let search_queries: SearchQuery[] = [];
                      search_queries.push(search_query);

                      this.search_query_by_category.push({
                                name:              search_query.category,
                                search_queries:    search_queries
                      });
                      category_index ++;
                    }
                    else {
                      this.search_query_by_category[category_index].search_queries.push(
                             search_query 
                      )
                    }
                   prev_search_query_category = search_query.category;

                })
                  console.log("Nemam Amma Bhagavan Sharanam -- search_query by category", this.search_query_by_category);
                }
                  ,
                
                error => this.errorMessage = <any>error
      );
  }
}



