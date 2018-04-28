var app = angular.module("NemamAmmaBhagavan", ['ngRoute', 'ngCookies','ngResource', 'ui.calendar', 'ui.bootstrap', 'ui.date',
											   'angular-flash.service', 'angular-flash.flash-alert-directive']);
				

		// Define routes
		app.config(['$routeProvider',
  			function($routeProvider) {

		    $routeProvider
		    	.when('/twitter_search_streams',
		    	{
		    		templateUrl: '/app/partials/add_search_query.html',
		        	controller: 'addSearchQueryController'
		    	})
		   	   	.when('/twitter_search_streams',
		   	   	{
		   	   		templateUrl: '/app/partials/add_search_query.html',
		       	 	controller: 'addSearchQueryController'
		    	})
		    	.when('/about_me',
		   	   	{
		   	   		templateUrl: '/app/partials/about.html',
		       	 	controller: ''
		    	})
		    	.when('/consultation',
		   	   	{
		   	   		templateUrl: '/app/partials/consultation.html',
		       	 	controller: ''
		    	})
		    	.when('/miracles',
		   	   	{
		   	   		templateUrl: '/app/partials/miracles.html',
		       	 	controller: 'miraclesController'
		    	})
		    	.when('/calendar',
		   	   	{
		   	   		templateUrl: '/app/partials/calendar.html',
		       	 	controller: 'calendarsController'
		    	})
		    	.when('/resources',
		   	   	{
		   	   		templateUrl: '/app/partials/resources.html',
		       	 	controller: 'resourcesController'
		    	})
		    	.when('/contact',
		   	   	{
		   	   		templateUrl: '/app/partials/contact.html',
		       	 	controller: 'contactController'
		    	})
		    	.when('/adminLogin',
		   	   	{
		   	   		templateUrl: '/app/partials/adminLogin.html',
		       	 	controller: 'adminLoginController'
		    	})
		    	.when('/adminLogout',
		   	   	{
		   	   		templateUrl: '/app/partials/about.html',
		       	 	controller: 'adminLogoutController'
		    	})
		   		.otherwise({
   					redirectTo: "/"
  				}); // Define routes

		}]); //config route provider
	
		// configure flash messages
		app.config(function (flashProvider) {

            // Support bootstrap 3.0 "alert-danger" class with error flash types
            flashProvider.errorClassnames.push('alert-danger');
            flashProvider.successClassnames.push('alert-success');
            flashProvider.infoClassnames.push('alert-info');
            /**
             * Also have...
             *
             * flashProvider.warnClassnames
             * flashProvider.infoClassnames
             * flashProvider.successClassnames
             */

        });

		// Define contollers
		var controllers = {};
		controllers.aboutController = function ($scope, $location, $anchorScroll, $cookieStore) {

			console.log("Nemam Amma Bhagavan Sharanam -- Loading the about controller");
			console.log("Nemam Amma Bhagavan Sharanam -- Cookie" + $cookieStore.get('user'));
		};  // Close controller

		controllers.pujasController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Pujas controller");
		}
		controllers.locationController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Location controller");
		}
		
		controllers.contactController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Pujas controller");
		}

		app.controller(controllers); 



