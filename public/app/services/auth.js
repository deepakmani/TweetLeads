'use strict';

var app = app;

app.factory('Auth', function Auth ($location, $rootScope, Session, $cookieStore, $http, $q) {
   // $rootScope.currentUser = $cookieStore.get('user') || null;
    //$cookieStore.remove('user');

    return {

      login: function(user, callback) {
      	console.log("Nemam Amma Bhagavan Sharanam -- Calling the login auth service" + user.username + user.password);

      	var cb = callback || angular.noop;
      	
		$http.post('/api/auth/session', {
									username:	user.username,
									password: 	user.password,
									rememberMe: true
								})
		    .success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		   
		   	$rootScope.currentUser = data.user.name;
		   	$cookieStore.put('user', data.user.name);
		   	console.log("Nemam Amma Bhagavan Sharanam -- Successfully logged in using passport + User:" + $cookieStore.get('user'));
      		return cb();
			
		 	}) // success promise
		 	.error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			   	//return cb(err.data);
		   		console.log("Nemam Amma Bhagavan Sharanam -- Error");
		  	}); // Error promise 
      }, // login factory method 

    logout: function() {
    		// Remove the user from cookieStore and passport to keep server in sync
    		$cookieStore.remove('user');
    		console.log("Nemam Amma Bhagavan Sharanam -- logging out");
    		$rootScope.currentUser = null;
    		//return;
    } // logout 
  } // return block

}); // Auth factory declaration
