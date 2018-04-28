var app = app;

app.controller('addResourceController', function($rootScope, $scope, $http, $modalInstance) {

	// Name: Add Resource method
	// Descr: Make http call to server to store a resource
	// 		  Promise to show the resource at the top with the correct bg color

	$scope.resource = {};

	// Set initial value for select tag
	$scope.resource.topic = "Greatness of India";
	$scope.addResource = function() {
		console.log("Nemam Amma Bhagavan Sharanam -- Resource Name" + $scope.resource.desc);
		$http.post('/api/addResource', {
								date: 		moment().unix(),
								title: 		$scope.resource.title,
								category: 	$scope.resource.topic,
								desc: 		$scope.resource.desc,
								username: 	$rootScope.currentUser
							}) // $http.pst
					 .success(function(data, status, headers, config) {		
					 	console.log("Nemam Amma Bhagavan Sharanam -- Stored the resource" + data + data.title);	
					 	// Get the resource
					 	$scope.newResource = data;	

					 	// resolve the resource into the scope of the Resources page
					 	$modalInstance.close($scope.newResource);

					 }); // success promise
	} // addResource method
});