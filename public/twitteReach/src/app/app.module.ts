import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { TwitterStreamsComponent } from './twitter_streams.component';
import { AddSearchQueryComponent } from './add_search_query.component';
import { TweetsComponent } from './tweets.component';
import { TemplatesComponent } from './templates.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SearchQueryService } from './searchQuery.service';
import { TweetService } from './tweet.service';
import { TweetTemplateService } from './tweetTemplate.service';

import { SearchQueryDirective } from './searchQuery.directive';
import { MarkTweetAsReadDirective } from './directives/markTweetAsRead';


import { RouterModule, Routes } from '@angular/router';

import { UiSwitchModule } from 'ngx-toggle-switch';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'twitter_search_streams',
    pathMatch: 'full'
  },
  {
    path: 'twitter_search_streams',
    component: TwitterStreamsComponent,
    children: [
                { 
                  path: 'tweets', 
                  component: TweetsComponent,
                },
                {
                  path:     'new_twitter_stream',
                  component: AddSearchQueryComponent
                }
               ]
   }
];


@NgModule({
  declarations: [
    AppComponent,
    TwitterStreamsComponent,
    AddSearchQueryComponent,
    SearchQueryDirective,
    TweetsComponent,
    TemplatesComponent,
    MarkTweetAsReadDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    MarkTweetAsReadDirective
  ],
  providers: [SearchQueryService, TweetService, TweetTemplateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
