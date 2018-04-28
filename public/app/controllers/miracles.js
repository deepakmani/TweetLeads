var app  = app;

app.controller('miraclesController', function($scope, $q, $http, flash, $modal, $location, $anchorScroll) {

	console.log("Nemam Amma Bhagavan Sharanam -- Calling the miracles controller");
	// Set the current page to display
	$scope.categories 		= ["All", "Health", "Wealth", "Relationships", "Marriage", "Education", "Career", "Other"];
	$scope.category_select 	= "All";
	$scope.currentPage 		= 1;
	$scope.itemsPerPage		= 10;
	$scope.numPages 		= 3;
	$scope.miracles 		= new Array();

	// Display miracles for the first page
	show_miracles($http, $q, $scope, $location, $anchorScroll);
	
    $scope.pageChanged = function() {
    	console.log("Nemam Amma Bhagavan Sharanam --Current Page" + $scope.currentPage)
	 	// Move to the next page
	 	show_miracles($http, $q, $scope, $location, $anchorScroll);
	 	//window.location.hash = '#main-content';
	}; // pageChanged

	$scope.deleteMiracle = function() {

		// Get all the miracles that are checked
		var miraclesToDelete = new Array();
		for(var i = 0; i < $scope.miracles.length; i++) {
			if ($scope.miracles[i].isSelected == true)
				{
					miraclesToDelete.push($scope.miracles[i]._id);
					console.log("Nemam Amma Bhagavan Sharanam  -- Deleting" + miraclesToDelete[i]);
				}

		} // For loop to select inputs to delete

		// Delete miracle api
    	$http.delete('/api/deleteMiracles/', {
    											params: {
													miraclesToDelete: miraclesToDelete,
													count: miraclesToDelete.length
												}
											})
	    	.success(function(data, status, headers, config) {
	    		// Deleted succesfully
	    		console.log("Nemam Amma Bhagavan Sharanam -- Deleted successfully");
	    		show_miracles($http, $q, $scope, $location, $anchorScroll);

	    	})
	    	.error(function(data, status, headers, config) {
				console.log("Nemam Amma Bhagavan Sharanam -- Unable to delete the miracle");
			});

	} // deleteMiracle

	
	// Name: addMiracle
	// Desc: Open modal that displays miracle 
	//       Do pagination and show miracles
	$scope.addMiracle = function() {

		// Miracle object that is returned by modal
		$scope.miracle    = {};

		var modalInstance = $modal.open({
     		 templateUrl: '/app/partials/add_miracle.html',
      		 controller: 'addMiracleController',
      		 //backdrop: 	false,
     		 size: 400
		}); //modalInstance.open

		// Display the miracle at the top of the miracles page
		modalInstance.result.then(function (newMiracle) {
			flash.success 		= "Added new Miracle!";
			$scope.currentPage 	= 1;
			//var data 			= get_miracles($http, $q, $scope);
			// Add miracle
			$scope.miracles.unshift(newMiracle);
			
			// Remove miracle
			$scope.miracles.splice(10, 1);

			// Update the total items
			$scope.totalItems	= $scope.totalItems  + 1;

 	      // Animate and show the miracle
	    }, function () {
	      console.log('Nemam Amma Bhgavan Sharanam Modal dismissed at: ' + new Date());
	    }); // ModalInstance.result
	} // addMiracle 


}); // Controller

function show_miracles($http, $q, $scope, $location, $anchorScroll) {
	$http.get('/api/getMiracles', { 
									params: {
										currentPage: $scope.currentPage,
										itemsPerPage: $scope.itemsPerPage
									} 
								})
		.success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// Empty the miracles
		$scope.miracles = data.miracles;
		

		// Update the total count
		$scope.totalItems	= data.count;
		// Scroll to the top 
		var old = $location.hash();
		$location.hash('main-content');
	 	$anchorScroll();
	 	$location.hash(old);


		console.log("Nemam Amma Bhagavan Sharanam -- Calling show miracles Count:" + data.miracles.length);
	})
	.error(function(data, status, headers, config) {
	   console.log("Nemam Amma Bhagavan Sharanam No miracles found");
	 });
} // show_miracles