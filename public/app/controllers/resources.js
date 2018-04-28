var app  = app;

app.controller('resourcesController', function($scope, $q, $http, flash, $modal, $location, $anchorScroll) {

	console.log("Nemam Amma Bhagavan Sharanam -- Calling the resources controller");
	// Set the current page to display
	$scope.topics 			= ["All", "Greatness of India", "Knowledge", "Other"];
	$scope.topic_select 	= "All";
	$scope.currentPage 		= 1;
	$scope.itemsPerPage		= 5;
	$scope.numPages 		= 3;
	$scope.resources 		= new Array();

	// Display resources for the first page
	show_resources($http, $q, $scope, $location, $anchorScroll);
	
    $scope.pageChanged = function() {
    	console.log("Nemam Amma Bhagavan Sharanam --Current Page" + $scope.currentPage)
	 	// Move to the next page
	 	show_resources($http, $q, $scope, $location, $anchorScroll);
	 	//window.location.hash = '#main-content';
	}; // pageChanged


	$scope.deleteResource = function() {

		// Get all the miracles that are checked
		var resourcesToDelete = new Array();
		for(var i = 0; i < $scope.resources.length; i++) {
			if ($scope.resources[i].isSelected == true)
				{
					resourcesToDelete.push($scope.resources[i]._id);
					console.log("Nemam Amma Bhagavan Sharanam  -- Deleting" + resourcesToDelete[i]);
				}

		} // For loop to select inputs to delete

		// Delete resources api
    	$http.delete('/api/deleteResources/', {
    											params: {
													resourcesToDelete: resourcesToDelete,
													count: resourcesToDelete.length
												}
											})
	    	.success(function(data, status, headers, config) {
	    		// Deleted succesfully
	    		console.log("Nemam Amma Bhagavan Sharanam -- Deleted successfully");
	    		show_resources($http, $q, $scope,  $location, $anchorScroll);

	    	})
	    	.error(function(data, status, headers, config) {
				console.log("Nemam Amma Bhagavan Sharanam -- Unable to delete the resource");
			});

	} // deleteResource

	// Name: addResource
	// Desc: Open modal that displays resource 
	//       Do pagination and show resources
	$scope.addResource = function() {

		// Resource object that is returned by modal
		$scope.resource   = {};

		var modalInstance = $modal.open({
     		 templateUrl: '/app/partials/add_resource.html',
      		 controller: 'addResourceController',
      		 //backdrop: 	false,
     		 size: 400
		}); //modalInstance.open

		// Display the resource at the top of the resource page
		modalInstance.result.then(function (newResource) {
			flash.success 		= "Added new Resource!";
			$scope.currentPage 	= 1;
			//var data 			= get_miracles($http, $q, $scope);
			// Add resource
			$scope.resources.unshift(newResource);
			
			// Remove last resource
			$scope.resources.splice(10, 1);

			// Update the total items
			$scope.totalItems	= $scope.totalItems  + 1;

 	      // Animate and show the miracle
	    }, function () {
	      console.log('Nemam Amma Bhgavan Sharanam Modal dismissed at: ' + new Date());
	    }); // ModalInstance.result
	} // addResource 

}); // Controller

function show_resources($http, $q, $scope, $location, $anchorScroll) {
	$http.get('/api/getResources', { 
									params: {
										currentPage: $scope.currentPage,
										itemsPerPage: $scope.itemsPerPage
									} 
								})
		.success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// Empty the miracles
		$scope.resources = data.resources;
		

		// Update the total count
		$scope.totalItems	= data.count;
		
		// Scroll to the top 
		var old = $location.hash();
		$location.hash('main-content');
	 	$anchorScroll();
	 	$location.hash(old);

		console.log("Nemam Amma Bhagavan Sharanam Count:" + data.resources.length);
	})
	.error(function(data, status, headers, config) {
	   console.log("Nemam Amma Bhagavan Sharanam No miracles found");
	 });
} // show_resources
