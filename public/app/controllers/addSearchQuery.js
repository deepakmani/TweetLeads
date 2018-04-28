var app  = app;

app.controller('addSearchQueryController', function($scope, $q, searchQueryService, flash, $modal, $location, $anchorScroll) {

	// 0. Collect screen_name 
	//var screen_name 	= UserService.screen_name;
   	var	  screen_name   	= "DeepakABS";

	// 1. Initialize new search_query
	$scope.new_search_query = {
							keyword: 			"",
							exclude_keyword: 	"",
							exclude_keywords: 	new Array(),
							type: 				"Tweets",
							exclude_links:    	true,
							exclude_media: 		true,
							exclude_retweets: 	true,
   							locations: 			new Array(),
   							category: 			"",
   							screen_name: 		screen_name,
   							enable_auto_tweet:  "No",
   						};


   	// 2. Use API to find queries related to the process of using this product
     $scope.generate_search_queries = function() {

     	// Find keywords 
     	var generated_keywords = new Array();
     		generated_keywords.push($scope.new_search_query.keyword);

     	// When there are keywords
     	if (generated_keywords.length > 0) {
	     	// Map the search_query fields to each keyword	
	     	$scope.new_search_queries  = new Array();
	     	generated_keywords.forEach(function(val, i) {
	     		// Check if generated keyword exists 
		     	$scope.new_search_queries.push({

		     									keyword: 			val,
												exclude_keywords: 	$scope.new_search_query.exclude_keywords,
												type: 				$scope.new_search_query.type,
												exclude_links:    	$scope.new_search_query.exclude_links,
												exclude_media: 		$scope.new_search_query.exclude_media,
												exclude_retweets: 	$scope.new_search_query.exclude_retweets,
		   										locations: 			$scope.new_search_query.locations,
		   										category: 			$scope.new_search_query.category,
		   										screen_name: 		screen_name,
		   										enable_auto_tweet:  "No",
		   										added: 				is_search_query_added(val, searchQueryService)
		   									});
		     });
	     }
	 }

	// 2. 
	$scope.add_search_queries = function(new_search_query) {
		// 1. Check if search query exists
		var new_search_queries = new Array();
		if (new_search_query) new_search_queries.push(new_search_query)

		// Add all queries
		else new_search_queries = $scope.new_search_queries;

		// 2. Add it to the db
		searchQueryService.addNewSearchQueries(new_search_queries)
		.success(function(data) {
			console.log("Nemam Amma Bhagavan Sharanam -- returned data", data);
			if (new_search_query) new_search_query.added = true;
			else $scope.new_search_queries.forEach(function(val, i) {
				val.added = true;
			});
			// Add values to new array	
		})
		.error(function(data){

		})
		// 3. Return status

		// 4. Update search_queries service
	}
	
}); // show_miracles

function is_search_query_added(keyword, searchQueryService) {
	// Loop through search queries
	var search_query_added = false;
	console.log("Nemam Amma Bhagavan Sharanam sq", searchQueryService.search_queries);
	searchQueryService.search_queries.forEach(function(val, i) {
		
		// Check if search_queries exists
		if (val.keyword == keyword) search_query_added = true;

	});
	
	return search_query_added;
}