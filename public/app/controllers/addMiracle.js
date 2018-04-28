var app = app;

app.controller('addMiracleController', function($rootScope, $scope, $http, $modalInstance) {

	// Name: Add Miracle method
	// Descr: Make http call to server to store a miracle
	// 		  Promise to show the miracle at the top with the correct bg color

	$scope.miracle = {};

	// Set initial value for select tag
	$scope.miracle.category = "Health";
	$scope.addMiracle = function() {
		console.log("Nemam Amma Bhagavan Sharanam -- Miracle Name" + $scope.miracle.desc);
		$http.post('/api/addMiracle', {
								name: 		$scope.miracle.name,
								location: 	$scope.miracle.location,
								date: 		moment().unix(),
								title: 		$scope.miracle.title,
								category: 	$scope.miracle.category,
								desc: 		$scope.miracle.desc,
								username: 	$rootScope.currentUser
							}) // $http.pst
					 .success(function(data, status, headers, config) {		
					 	console.log("Nemam Amma Bhagavan Sharanam -- Stored the miracle" + data + data.title);	
					 	// Get the miracle
					 	$scope.newMiracle = data;	

					 	// resolve the miracle into the scope of the Miracles page
					 	$modalInstance.close($scope.newMiracle);

					 }); // success promise
	} // addMiracle method
});