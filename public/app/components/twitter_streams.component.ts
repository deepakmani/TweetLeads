import { Component, OnInit } from '@angular/core';
 
import { SearchQueryService } from "../services/searchQuery.service";

// Twitter Search Streams Route and Component
@Component({
   template: `
  		<!-- SearchQueryComponent -->
    	<div class="row">
				<div class="col-md-12">
					<div class="col-md-4">
						 
         	 		</div>
         	 	</div>
        </div> 	 
        
        <!-- AddSearchQueryComponent -->
        `
,
 providers: [
   SearchQueryService
  ]})

export class TwitterStreamsComponent implements OnInit  {
	 
	//search_queries: SearchQuery[] = new Array();


	constructor(public SearchQueryService: SearchQueryService) { }
 	 
	ngOnInit() {
		console.log("Nemam Amma Bhagavan Sharanam -- oninit");
 	// SearchQueryService.get_search_queries()
 	// .subscribe(search_queries => this.search_queries = search_queries);
	}
}
