import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SearchQuery } from './SearchQuery';
import { SearchQueryService } from './searchQuery.service';
import { AddedSearchQueryService } from './AddedSearchQuery.service';
import { FormControl, FormGroup,  Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'add-search-query',
   template: `

   		<form [formGroup]="addSearchQueryForm" (ngSubmit)="onSubmit()">
  		<div class="form-group">
  			<label>
  				Keyword
  				<br/>
  				<input type="text" class="mdl-textfield__input" id="name"
         			 formControlName="keyword"
         			 name="keyword" #keyword>
  			</label>	
  			<br/>
  			<label>
  				Category
  				<br/>
  				<input type="text" class="mdl-textfield__input" id="category"
         			 formControlName="category"
         			 name="category" >
  			</label>	
  			<br/>
  			<label class="add-search-query-form-label">
				<span > Type  </span>
				<br/>
				<span> Tweets </span>
   				<input type="radio" formControlName="type" value="Tweets">
				 <span style="margin-left:20px"> Followers </span>
   				<input type="radio" formControlName="type" value="Followers">
			 
			</label>	
			<label>
  				Locations
  				<br/>
  				<input type="text" class="mdl-textfield__input" id="locations"
         			 formControlName="locations"
         			 name="locations" >
  			</label>	
			<br/>
  			<label class="add-search-query-form-label">
				<span> Exclude Keywords  </span>
				<br/>
				<input type="text" formControlName="exclude_keywords" class="mdl-textfield__input"> 
<!-- 			<button class="btn btn-primary" (click)="add_exclude_keyword"> <i class="fa-plus fa"> </i> </button> -->
			</label>
			<br/>
			<label class="add-search-query-form-label">

				<span>  Exclude  </span>
				<br/>

				<span> Retweets </span> 
				<input type="checkbox" class="mdl-checkbox__input" formControlName="exclude_retweets">
     		
     			<span class="add-search-query-form-label" style="margin-left:20px"> Links  </span>
				<input type="checkbox" class="mdl-checkbox__input" formControlName="exclude_links">

				<span class="add-search-query-form-label" style="margin-left:20px">  Media  </span>
				<input type="checkbox" class="mdl-checkbox__input" formControlName="exclude_media">

				<span class="add-search-query-form-label" style="margin-left:20px">  Bots  </span>
				<input type="checkbox" class="mdl-checkbox__input" formControlName="exclude_bots">
			</label>
			<br/>

			<button type=submit class="mdl-button mdl-button--primary add-search-query-button" style="background:#423; color:#FFF"> Generate Keywords </button>	
			</div>
  		</form>

  		<br/>
		<br/>

		<table id="add-search-query-table" *ngIf="new_search_queries.length > 0">
			<tbody  *ngFor="let search_query of new_search_queries">
				<tr>
					<td> 
							{{search_query.keyword}}   

					</td>
					<td>
						<span *ngIf="search_query.added; else elseAddSearchQuery"> 
							<button class="mdl-button mdl-button--primary add-search-query-button"> Added </button> 
						</span>
						<ng-template #elseAddSearchQuery> 
							<button class="mdl-button mdl-button--primary add-search-query-button" (click)="add_search_queries(search_query)"> Add Search Query </button> 
						</ng-template>
					</td>
				</tr>
			</tbody>
		</table>


                 `
})
export class AddSearchQueryComponent implements OnInit {
 public search_queries: 			SearchQuery[] = [];	
 @Output() added_search_queries 	= 			new EventEmitter<SearchQuery[]>();
 search_query: 					SearchQuery = new SearchQuery("Linkedin", "DeepakABS", "Default", "Tweet");
 new_search_queries: 			SearchQuery[] = [];

         addSearchQueryForm = new FormGroup ({
   			                	  keyword: 	new FormControl("Linkedin", Validators.required),
   			                	  type: 	new FormControl("Tweet", Validators.required),
   			                	  category: new FormControl("Default"),
   			                	  locations: new FormControl(),
   			                	  exclude_keywords: new FormControl(),
   			                	  exclude_retweets: new FormControl(),
   			                	  exclude_links: 	new FormControl(),
   			                	  exclude_media: new FormControl(),
   			                	  exclude_bots: new FormControl()

  		                    });
 constructor(public SearchQueryService: SearchQueryService, public AddedSearchQueryService: AddedSearchQueryService ) {}

  
	private is_added(keyword): boolean {

		let search_query_added = false;
		
		return search_query_added;
	}	

	ngOnInit(){ 
		// Collect SearchQueries
		this.SearchQueryService.get_search_queries()
		.subscribe((search_queries) => {
			this.search_queries = search_queries;
		});
	}


 	onSubmit() {
 		this.generate_search_queries();
 	}
	generate_search_queries = () => {
		const formModel = this.addSearchQueryForm.value;

		// Find keywords 
     	let generated_keywords = new Array();
     		generated_keywords.push(formModel.keyword);
     	console.log("Nemam Amma Bhagavan Sharanam -- Generted keywords", generated_keywords);		
     	// When there are keywords
     	if (generated_keywords.length > 0) {
	     	// Map the search_query fields to each keyword	
	     	generated_keywords.forEach((generated_keyword, index) => {
	     		// Check if generated keyword exists 
	     		let search_query_added = false;
	     		this.search_queries.forEach(function(val, i) {
					if (val.keyword == generated_keyword) search_query_added = true;
				});
	     		console.log("Nemam Amma Bhagavan Sharanam -- search query added", search_query_added, " keyword", generated_keyword );
		    	 let search_query: SearchQuery = {
		     									keyword: generated_keyword, 
		     									screen_name: "DeepakABS", 
		     									category: formModel.category, 
		     									type: 	formModel.type,
		     									locations: formModel.locations, 
		     									exclude_keywords: formModel.exclude_keywords, 
		     									exclude_retweets: formModel.exclude_retweets,
		     									exclude_links: 	  formModel.exclude_links,	
		     									exclude_media: 	  formModel.exclude_media, 
		     									exclude_bots: 	  formModel.exclude_bots,
		     									added: 			  search_query_added,
		     									template_names:    []		
		     								}
		     	this.new_search_queries.push(search_query);
		     });		
		}						

			  
	}

	add_search_queries = (new_search_query) => {
		let new_search_queries: SearchQuery[] = [];
		
		if (new_search_query) new_search_queries.push(new_search_query)

		// Add all queries
		else new_search_queries = this.new_search_queries;

		// 2. Add it to the db
		this.SearchQueryService.add_search_queries(new_search_queries)
		 .subscribe(
                data => { 
                			if (data.status) {
                				if (new_search_query) new_search_query.added = true;
                				
                				else {
                					this.new_search_queries.forEach((val, i) => {
                						val.added = true;
                					});
                				}
                				this.AddedSearchQueryService.emit_added_search_query(new_search_queries);
                			}
                		},
                //error => this.errorMessage = <any>error
      	);
	}

 }
