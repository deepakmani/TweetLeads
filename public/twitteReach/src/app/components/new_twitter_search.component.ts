import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TweetService } from "../tweet.service";
import { SearchQueryService } from "../searchQuery.service";
import { AddedSearchQueryService } from "../AddedSearchQuery.service";
import { Tweet } from "../Tweet";
import { SearchQuery } from "../SearchQuery";
 
@Component({
    template: `
 
     <h3> Search Twitter </h3>
    <div id="search-twitter">
   		<form [formGroup]="searchTwitterForm">
    		<div class="form-group">
    			<label>
    				Keyword
    				<br/>
    				<input  style="height:50px; width: 400px;" type="text" class="mdl-textfield__input" id="search-twitter-keyword"
           			 formControlName="keyword"
           			 name="keyword" #keyword >
    			</label>	
          <label>
           Category
            <br/>
            <input  style="height:50px; width: 400px;" type="text" class="mdl-textfield__input" id="search-twitter-category"
                  formControlName="category"
                  name="category" #category>
           </label>       
          <br/>

         <label class="add-search-query-form-label">

            <span style="margin-right:30px">  Exclude:  </span>

            <span> Retweets </span> 
            <input type="checkbox" class="mdl-checkbox__input" id="exclude-retweets" formControlName="exclude_retweets">
             
            <span class="add-search-query-form-label" style="margin-left:20px"> Links  </span>
            <input type="checkbox" class="mdl-checkbox__input" id="exclude-links" formControlName="exclude_links">
          
            <span class="add-search-query-form-label" style="margin-left:20px"> Media  </span>
            <input type="checkbox" class="mdl-checkbox__input" id="exclude-media" formControlName="exclude_media">
          
          </label>  
          
          <br/>
           <label>
           

            <span class="add-search-query-form-label"> Auto Follow  </span>
            <input type="checkbox" class="mdl-checkbox__input" id="auto-follow" formControlName="auto_follow">
            
            <span class="add-search-query-form-label" style="margin-left:20px"> Search Potential Need Keywords  </span>
            <input type="checkbox" class="mdl-checkbox__input" id="search_potential_need_keywords" formControlName="search_potential_need_keywords">
                
          </label>  
          <br/>
          <br/>

          <button (click)="search_twitter()"  style="background: #B29; color:#FFF" id="search-twitter" class="mdl-button mdl-button--primary" > Search  </button> 

          <button class="mdl-button mdl-button--primary" style="background: #22F; color:#FFF" (click)="save_search_query()"> Save </button>  
          
        </div>

      </form> 

       <div *ngIf="searching_twitter; else searchComplete">
         <i class="fa fa-spinner fa-spin"> </i>
       </div> 

       <ng-template #searchComplete> 
           <div *ngIf = 'tweets.length == 0; else displayTweets'>

           </div>
          <ng-template #displayTweets>
            <h4 id="tweet-count"> {{tweets.length}} Tweets </h4>
            <table class="tweets-table"> 
             
             <tbody style="cursor:pointer" *ngFor="let tweet of tweets">
               <tr>
                 <td> 
                   <input type="checkbox">  <img src="{{ tweet.profile_img_url }}" style="margin-left:10px" />
                 </td> 
                 <td> 
                   {{ tweet.name }}
                   <br/>
                   <span style="font-size:10px"> @{{ tweet.screen_name }} </span>
                 </td> 
                 <td> 
                   {{ tweet.location }}
                 </td> 
                 <td>
                   
                 </td>
               </tr>
               <tr class="tweet-text-row" (click)="visit_tweet(tweet)">
                 <td colspan="4">
                   {{ tweet.text }}
                 </td>
               </tr>
              </tbody>


            </table>
          </ng-template> 
       </ng-template>
    </div>
  	`
})

export class NewTwitterSearchComponent implements OnInit {

  // 1. Define form group
  public search_queries: any[];

  public searchTwitterForm = new FormGroup({
                                              keyword:                             new FormControl("linkedin, \"nigeria javascript job\"", 
                                                                                  [Validators.required, Validators.minLength(3)]),
                                              exclude_retweets:                    new FormControl(true),
                                              exclude_links:                        new FormControl(true),
                                              exclude_media:                        new FormControl(true),
                                              category:                             new FormControl("Default"),
                                              auto_follow:                          new FormControl(false),
                                              search_potential_need_keywords:      new FormControl(false)

                                          });

 // Searching twitter
 public searching_twitter: Boolean;
 
 // Saving 
 public search_query_saved: Boolean;

 // Tweets
 public tweets:           Tweet[] = [];


 constructor(public TweetService: TweetService, public SearchQueryService: SearchQueryService, public AddedSearchQueryService: AddedSearchQueryService) {

 }

  ngOnInit() {

   this.SearchQueryService.get_search_queries()
   .subscribe((search_queries) => {
       this.search_queries = search_queries;

       console.log("Nemam Amma Bhagavan Sharanam -- sqs:", this.search_queries);
     });
 }

 public search_twitter = () => {
    let search_query: SearchQuery = this.build_search_query();

    this.TweetService.searchTwitter(search_query, "DeepakABS") 
    .subscribe((tweets) => {
      this.tweets = tweets;
      this.searching_twitter = false;
    },
    (error) => {

    });

 
  }

  // Save Search Query
  // 2. Add it to the db

     save_search_query = () => {   

      var new_search_query: SearchQuery = this.build_search_query();
      
      // Check if search query exists
      if (!this.is_search_query_saved(new_search_query)) {
        this.searching_twitter = true;
        this.SearchQueryService.saveNewSearchQuery(new_search_query)
         .subscribe(
                    data => { 

                          this.searching_twitter = false;

                          if (data.status) {
                              this.tweets = data.tweets;
                              new_search_query.tweet_count = this.tweets.length;
                              this.AddedSearchQueryService.emit_added_search_query(new_search_query);
                            }
                           else {

                           } 
                        
                   }
                        ,
                    //error => this.errorMessage = <any>error
            );
       }
       else {
           this.search_query_saved = true;
       }
     };

   is_search_query_saved = (new_search_query) => {
    
     this.search_queries.forEach((search_query) => {
         if (new_search_query.keyword == search_query.keyword)
           return true;
     });

     return false;

   }

    build_search_query = () => {
       // Form Model
      let formModel           = this.searchTwitterForm.value;
      let keyword             = formModel.keyword;
      let category             = formModel.category;
      let exclude_retweets    = formModel.exclude_retweets;
      let exclude_links       = formModel.exclude_links;
      let exclude_media       = formModel.exclude_media;
      let auto_follow         = formModel.auto_follow;
      let search_potential_need_keywords = formModel.search_potential_need_keywords;
      // Set searching spinner to true
     

      let search_query: SearchQuery =  {
                                            keyword:         keyword,
                                            category:         category,
                                            screen_name:       "DeepakABS",
                                            exclude_retweets: exclude_retweets,
                                            exclude_links:     exclude_links,
                                            exclude_media:     exclude_media,
                                            auto_follow:       auto_follow,
                                            search_potential_need_keywords:  search_potential_need_keywords
                                       };
      return search_query;                                 
    }
 
}

