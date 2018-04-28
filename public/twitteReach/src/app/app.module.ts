import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { TwitterStreamsComponent } from './twitter_streams.component';
import { AddSearchQueryComponent } from './add_search_query.component';
import { TweetsComponent } from './tweets.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SearchQueryService } from './searchQuery.service';
import { SearchQueryDirective } from './searchQuery.directive';


import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'twitter_search_streams',
    pathMatch: 'full'
  },
  {
    path: 'twitter_search_streams',
    component: TwitterStreamsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TwitterStreamsComponent,
    AddSearchQueryComponent,
    SearchQueryDirective,
    TweetsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [SearchQueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
