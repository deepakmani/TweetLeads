import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { TwitterStreamsComponent } from './components/twitter_streams.component';
import { NewTwitterSearchComponent } from './components/new_twitter_search.component';
import { TweetsComponent } from './tweets.component';
import { SendTweetComponent } from './components/sendTweet.component';
import { TweetTemplatesComponent } from './components/TweetTemplates.component';
import { HomeComponent } from './components/home.component';

import { ChartsModule } from 'ng2-charts';

import { TemplatesComponent } from './templates.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SearchQueryService } from './searchQuery.service';
import { TweetService } from './tweet.service';
import { TweetTemplateService } from './tweetTemplate.service';

import { SearchQueryDirective } from './searchQuery.directive';
import { MarkTweetAsReadDirective } from './directives/markTweetAsRead';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
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
                  path:     "",
                  redirectTo: "new_twitter_search",
                  pathMatch: "full"
                 },
                { 
                  path: 'tweets', 
                  component: TweetsComponent,
                },
                {
                  path:     'new_twitter_search',
                  component: NewTwitterSearchComponent
                }
               ]
   },
   {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
    AppComponent,
    TwitterStreamsComponent,
    NewTwitterSearchComponent,
    SearchQueryDirective,
    TweetsComponent,
    TemplatesComponent,
    MarkTweetAsReadDirective,
    SendTweetComponent,
    TweetTemplatesComponent,
    HomeComponent,
  ],
  imports: [
   // MDBBootstrapModule.forRoot(),
    ChartsModule,
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
