import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
 
import { TweetService } from "./tweet.service";
import { SearchQueryDirective } from "./searchQuery.directive";

import { Tweet } from "./Tweet";
import { SearchQuery } from "./SearchQuery";
import { TweetTemplate } from "./TweetTemplate";

import { TweetTemplateService } from "./tweetTemplate.service";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { FormControl, FormGroup,  Validators} from '@angular/forms';


// Twitter Search Streams Route and Component
@Component({
   selector: 'templates',
   template: `
  		<!-- TemplatesComponent -->
  			<div class="templates">
	  			<div class="close-templates" >
	  				<span *ngIf="autoTweet">
	  					Auto Tweet using Template
	  				</span>
	  				<span style="float:right; cursor:pointer" (click)="close_templates()">	close </span>
	  				
	  			</div>
	  			<br/>
	  			<br/>
	  			<label>
					Auto Tweet
					<br/>
					<ui-switch [(ngModel)]="enable_auto_tweet" size="small" labelOn="ON" labelOff="OFF"></ui-switch>
				</label>
					<label>
						Tweet Type
						<br/>
						 
					</label>
		  			<div class="mdl-grid">
						<div class="mdl-cell mdl-cell--6-col">
			             	<h3> Select Template </h3>
			            	<hr/>

			            	 <table style="width: 100%" class="templates-table">
				                <tbody  *ngFor="let tweet_template_category of tweet_templates_by_category">
				                   
				                     <tr>
				                        <td colspan='2' class="search-query-category"> {{ tweet_template_category.name }} </td>
				                    </tr>

				                    <tr [ngClass]="{'selected-tweet-template': tweet_template.selected, 'unselected-tweet-template': !tweet_template.selected}" *ngFor="let tweet_template of tweet_template_category.tweet_templates">
					                    	<td> <input (click)="selectTweetTemplate(tweet_template)" type="checkbox"> </td>
					                     <td style="font-size: 15px; color:#999"> {{ tweet_template.template_name }} 
					                     	<br/>
					                     	{{ tweet_template.text }}
					                     </td>
					                     
					                </tr>
				                </tbody>
				            </table>
			            </div>
			          	  
			            <div style="border-left:1px solid #777; padding-left:20px" class="mdl-cell mdl-cell--6-col">
			             	<form [formGroup]="newTemplateForm" (ngSubmit)="onSubmit()">

				             	<h3> Create Template </h3>
				            	<hr/>
				           
					         	<div class="form-group">
						  			<label>
						  				Category
						  				<br/>
						  				<input type="text" class="mdl-textfield__input" id="category"
						         			 formControlName="category"
						         			 name="category">
				  					</label>	
				  					<br/>
				  					<label>
				  					 	 <div *ngIf="name.invalid && (name.dirty || name.touched)"
											     class="alert alert-danger">
											  <div *ngIf="name.errors.required">
											    Name is required.
											  </div>
										</div>	  
				  						Name
						  				<br/>
						  				<input type="text" class="mdl-textfield__input" id="name"
						         			 formControlName="name"
						         			 name="name">
				  					</label>
				  					<label>

				  						 <div *ngIf="tweetText.invalid && (tweetText.dirty || tweetText.touched)"
											     class="alert alert-danger">
											  <div *ngIf="tweetText.errors.required">
											    Tweet is required.
											  </div>

											   <div *ngIf="tweetText.errors.maxlength">
											    Tweet cannot exceed 280 characters
											  </div>
										</div>	 
				  						Tweet
						  				<br/>

						  					<textarea  formControlName="tweetText"  name="tweetText" class="mdl-textfield__input" type="text" rows="5s" id="sample5"></textarea>

						  		
				  					</label>

				  					<button type=submit class="mdl-button mdl-button--primary save-tweet-template-button" style="background-color:#A37; color:#FFF"> Save </button>	

				  				</div> <!-- Col 6 -->
				  			</form>		

				  		</div> <!-- Grid -->		
					</div>
			 </div>
  			`
 })
export class TemplatesComponent implements OnInit  {
	 
	@Output() closeTweetTemplates = new EventEmitter<boolean>();
	@Input() search_query: 						SearchQuery;
	public 	enable_auto_tweet: 					boolean;
	public 	new_tweet_template: 				TweetTemplate; 
	public tweet_templates_by_category: 		any[] = [];

	get name() { return this.newTemplateForm.get('name'); }

	get category() { return this.newTemplateForm.get('category'); }

	get tweetText() { return this.newTemplateForm.get('tweetText'); }
    
    newTemplateForm = new FormGroup ({
    							  // Req and must not be duplicate
   			                	  name: 	new FormControl("", Validators.required),
   			                	  category: new FormControl("Default"),
   			                	  // Required and max 120 characters
   			                	  tweetText: 	new FormControl("", [Validators.required, Validators.maxLength(280)]),
  		                    });
    
 	constructor(public TweetTemplateService: TweetTemplateService) { 
   

 	}
 	ngOnInit(){
 		// Search templates
 		this.enable_auto_tweet = (this.search_query.template_names.length > 0) ? true : false; 
    	this.TweetTemplateService.get_tweet_templates()
    	.subscribe(tweet_templates => {
    		let category_exists: boolean = false;

    		tweet_templates.forEach((tweet_template, i) => {
    			this.tweet_templates_by_category.forEach((category, i) => {
	    			if (this.tweet_templates_by_category[i].name == tweet_template.category) {
	    				// Existing template is in search query
    					if (this.search_query.template_names.indexOf(tweet_template.template_name) != -1) 
    						tweet_template.selected = true;
	    				else 
	    					tweet_template.selected = false;
	    				this.tweet_templates_by_category[i].tweet_templates.push(tweet_template);

	    				category_exists = true;
	    			}
	    		});
	    		if (!category_exists) 
	    			// Existing template is in search query
    				if (this.search_query.template_names.indexOf(tweet_template.template_name) != -1) 
    					tweet_template.selected = true;
    				else 
    					tweet_template.selected = false;
	    			this.tweet_templates_by_category.unshift({name: tweet_template.category, tweet_templates:[tweet_template]})
    		});
    	})
    }
    selectTweetTemplate(tweet_template: TweetTemplate) {
    	tweet_template.selected = !tweet_template.selected;
    	if (tweet_template.selected)
    	{
    		// Bind template to search query
    		let search_query = this.search_query;
    			search_query.template_names.push(tweet_template.template_name);
    		this.TweetTemplateService.save_tweet_template_search_query(tweet_template, search_query)
    		.subscribe(status => {
    			// Highlight entire template
    			if(status) {

    			}
    		})	
    	}
    	else {
    		let search_query = this.search_query;
    		let index 		 = search_query.template_names.indexOf(tweet_template.template_name);
    		search_query.template_names.splice(index, 1);
    		this.TweetTemplateService.save_tweet_template_search_query(tweet_template, search_query)

    	}
    }
    onSubmit() {
    	this.saveTemplateAndAutoTweet();
    }
    close_templates() {
    	 this.closeTweetTemplates.emit(true);
    }
    saveTemplateAndAutoTweet = () => {
 		// 1. Collect template parameters
 		const formModel = this.newTemplateForm.value;
 		let   link  	= formModel.tweetText.match(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}/);
 			  link 		= link ? link[0] : null;


 		// Call service
 		let tweet_template: TweetTemplate =	{	    screen_name: 		"DeepakABS", 
				 									category: 			formModel.category, 
				 									template_name: 		formModel.name, 
				 									text: 				formModel.tweetText,
				 									link: 				link
				 								};

		let search_query = this.search_query;
			search_query.template_names.push(formModel.name);
			search_query.auto_tweet_type 	=  "Tweet";

		this.TweetTemplateService.save_tweet_template_search_query(tweet_template, search_query)
		.subscribe(status => {
			if (status) {
				// Update search query and emit it to parent for future
				this.search_query.template_names.push(tweet_template.template_name);

				tweet_template.selected = true;

				// Add template and select it
				let category_present: boolean = false;
				     this.tweet_templates_by_category.forEach((val, index) => {

				       // 2. Check if matches
				       if (val.name == tweet_template.category) {
				         // 3. unshift the search query in search_query_by_category
				         this.tweet_templates_by_category[index].tweet_templates.unshift(tweet_template);
				         
				         category_present = true;
				       }
				     })
				     // If category is new
				     if (!category_present) {
			     	
				       // unshift category and search query
				       this.tweet_templates_by_category.unshift({name:           tweet_template.category, 
				                                             	 tweet_templates: [tweet_template]
				                                            });
				     }

				this.enable_auto_tweet = true;     
			}
		})		 								


    }
    autoTweet() {
    	
    }
};    	