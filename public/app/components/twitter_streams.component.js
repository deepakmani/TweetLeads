"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var searchQuery_service_1 = require("../services/searchQuery.service");
// Twitter Search Streams Route and Component
var TwitterStreamsComponent = /** @class */ (function () {
    //search_queries: SearchQuery[] = new Array();
    function TwitterStreamsComponent(SearchQueryService) {
        this.SearchQueryService = SearchQueryService;
    }
    TwitterStreamsComponent.prototype.ngOnInit = function () {
        console.log("Nemam Amma Bhagavan Sharanam -- oninit");
        // SearchQueryService.get_search_queries()
        // .subscribe(search_queries => this.search_queries = search_queries);
    };
    TwitterStreamsComponent = __decorate([
        core_1.Component({
            template: "\n  \t\t<!-- SearchQueryComponent -->\n    \t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-12\">\n\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t \n         \t \t\t</div>\n         \t \t</div>\n        </div> \t \n        \n        <!-- AddSearchQueryComponent -->\n        ",
            providers: [
                searchQuery_service_1.SearchQueryService
            ]
        })
    ], TwitterStreamsComponent);
    return TwitterStreamsComponent;
}());
exports.TwitterStreamsComponent = TwitterStreamsComponent;
