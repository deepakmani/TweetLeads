import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TweetTemplate } from '../tweetTemplate';

@Component({
	selector: "show-tweet-templates",
	template: `<div *ngIf="initialized" class="show-tweet-templates">
	               	<div class="mdl-grid" style="width:100%">
						<div class="mdl-cell mdl-cell--6-col">
			             	<h4> Select Category </h4>
			            	<hr/>
			            	<table>
			            		<tbody *ngFor="let category of objectKeys(tweetTemplatesByCategory)">
			            		 	<tr>
			            				<td (click)="selectedCategory = category" [ngClass]="{'active-tweet-template-category': (selectedCategory == category),
			            																					'deactive-tweet-template-category': (selectedCategory != category)}"> 
			            				{{ category }}
			            				</td>

			            			</tr>
			            		</tbody>	
			            	</table>	
			            </div>
			          
			            <div class="mdl-cell mdl-cell--6-col" style="border-left:1px solid #777; padding-left:20px">
			            	<h4> Select Template </h4>
			            	<hr/>
		       
			            	 <table style="width: 100%;" class="templates-table">
				                <tbody class="select-tweet-templates" (click) = "selectTweetTemplate(tweetTemplate)" *ngFor="let tweetTemplate of tweetTemplatesByCategory[selectedCategory]">
				                 	<tr>
				                 		<td style="color:#999"> {{ tweetTemplate.template_name }} </td>
				                 	 
				                 	</tr>		

	               					<tr style="border-bottom: 1px solid #333">
	               						<td>
	               							{{ tweetTemplate.text }}
	               						</td>
	               					</tr>	
	               				

				               		</tbody>
				               </table>
						   </div>
						</div>   
					</div>	
			  `
				
})

export class TweetTemplatesComponent implements OnInit {
	@Input()  tweetTemplates: TweetTemplate[];


	public objectKeys: 					any 	= Object.keys;
	public selectedCategory: 			String 	= "";
	public tweetTemplatesByCategory: 	any 	= {};
	public initialized: 				Boolean = false;

	@Output() selectedTweetTemplate: EventEmitter<TweetTemplate> = new EventEmitter<TweetTemplate>();
	constructor() {


	}
	selectTweetTemplate(tweetTemplate) {
		this.selectedTweetTemplate.emit(tweetTemplate);
	}

	ngOnInit() {
		// Find out about tweetTemplateCategory
		this.tweetTemplates.forEach((tweetTemplate) => {
			// Add tweetTemplate
			if (!(tweetTemplate.category in this.tweetTemplatesByCategory)) {
				this.tweetTemplatesByCategory[tweetTemplate.category] = [tweetTemplate];
			}
			else {
				let tweetTemplates = this.tweetTemplatesByCategory[tweetTemplate.category];
				tweetTemplates.push(tweetTemplate);
				this.tweetTemplatesByCategory[tweetTemplate.category] = tweetTemplates;
			}
		});
		 // initialize category for now
		this.selectedCategory = this.tweetTemplates[0].category;
		this.initialized = true;
	}
}
