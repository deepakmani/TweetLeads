"use strict";
exports.__esModule = true;
var router_1 = require("@angular/router");
var twitter_streams_component_1 = require("../components/twitter_streams.component");
// Route Configuration
exports.routes = [
    { path: 'twitter_streams', component: twitter_streams_component_1.TwitterStreamsComponent },
];
// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];
exports.routing = router_1.RouterModule.forRoot(exports.routes);
