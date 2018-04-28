var app = app;

app.controller('adminLoginController', function($scope, $http, Auth, $rootScope, $location) {
	// Callback method after the Post method is called
	var cb 			= function (err) { 
				    	$scope.errors = {};
				        if (!err) 
				        {
				            $location.path('/#/');
				        } 
				        else 
				        {
				            angular.forEach(err.errors, function(error, field) {
				              form[field].$setValidity('mongoose', false);
				              $scope.errors[field] = error.type;
				            });
				            $scope.errors.other = err.message;
				        }
					};

	$scope.login = function() {	

		// Call Auth Service
		Auth.login({username: $scope.username, password: $scope.password}, cb);

	} // login form submit

}); // Login Controller