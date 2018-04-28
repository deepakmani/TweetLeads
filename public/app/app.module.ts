// ====== ./app/app.module.ts ======
// Imports
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

// Declarations
import { SearchQueryService }          from './services/searchQuery.service';
import { TwitterStreamsComponent }          from './components/twitter_streams.component';
import { AppComponent }         from './components/app.component';

import { routing } from './routes/app.routes';

// Decorator
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  declarations: [
    AppComponent,
    TwitterStreamsComponent,
    //AddSearchQueryComponent
  ],
  providers: [
    SearchQueryService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
    // Module class
}