import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwitterStreamsComponent } from '../components/twitter_streams.component';

// Route Configuration
export const routes: Routes = [
  { path: 'twitter_streams', component: TwitterStreamsComponent },
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);