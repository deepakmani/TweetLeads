'use strict';

var app = app;

app.factory('searchQueryService', function searchQuery ($location, $rootScope, Session, $cookieStore, $http, $q) {
   // $rootScope.currentUser = $cookieStore.get('user') || null;
   //$cookieStore.remove('user');

   var searchQueryService = {
   								search_queries: new Array()
   							};

   // Initialize search_queries property 
   $http.get('/api/getSearchQueries', {query: {screen_name: "DeepakABS"}})
   .success(function(search_queries) {
   		console.log("Nemam Amma Bhagavan Sharanam -- search_queries",search_queries );
   		// Set the property
   		searchQueryService.search_queries = search_queries;
   });

   searchQueryService.addNewSearchQueries = function(new_search_queries) {
	   return $http.post('/api/addNewSearchQueries', {new_search_queries: new_search_queries})
	}

   return searchQueryService;
});

