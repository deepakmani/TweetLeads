import { Component, OnInit, Input, Output} from '@angular/core';
 
import { SearchQueryService } from "./searchQuery.service";
import { SearchQueryDirective } from "./searchQuery.directive";

import { SearchQuery } from "./SearchQuery";
import { Observable } from 'rxjs/Observable';


// Twitter Search Streams Route and Component
@Component({
   selector: 'tweets',
   template: `
  		<!-- SearchQueryComponent -->
    	 	<table>
    	 		<tbody>
    	 			<tr>
    	 				<td> 
    	 			</tr>
    	 		</tbody>
    	`
    })
export class TweetsComponent {
	 public search_query: 	SearchQuery;	
	
	 // Detect input change
	 @Input()
  			set selected_search_query(selected_search_query: SearchQuery) {
    			this.search_query = selected_search_query;

    	// Invoke service			
  	}	
};