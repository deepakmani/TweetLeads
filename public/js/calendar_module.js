var app = angular.module("NemamAmmaBhagavan", ['ngRoute', 'ui.calendar', 'ui.bootstrap', 'ui.date']).value('$anchorScroll', angular.noop);

		// Define routes
		app.config(['$routeProvider',
  			function($routeProvider) {

		    $routeProvider
		    	.when('/',
		    	{
		    		templateUrl: '/partials/about.html',
		        	controller: 'aboutController'
		    	})
		   	   	.when('/pujas',
		   	   	{
		   	   		templateUrl: '/partials/puja.html',
		       	 	controller: 'pujasController'
		    	})
		    	.when('/location',
		   	   	{
		   	   		templateUrl: '/partials/location.html',
		       	 	controller: 'locationController'
		    	})
		    	.when('/miracles',
		   	   	{
		   	   		templateUrl: '/partials/miracles.html',
		       	 	controller: 'miraclesController'
		    	})
		    	.when('/calendar',
		   	   	{
		   	   		templateUrl: '/partials/calendar.html',
		       	 	controller: 'calendarsController'
		    	})
		    	.when('/resources',
		   	   	{
		   	   		templateUrl: '/partials/resources.html',
		       	 	controller: 'resourcesController'
		    	})
		    	.when('/contact',
		   	   	{
		   	   		templateUrl: '/partials/contact.html',
		       	 	controller: 'contactController'
		    	})
		   		.otherwise({
   					redirectTo: "/"
  				}); // Define routes

		}]); //config route provider

		// Define contollers
		var controllers = {};
		controllers.aboutController = ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {

			console.log("Nemam Amma Bhagavan Sharanam -- Loading the about controller");
		}];  // Close controller

		controllers.pujasController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Pujas controller");
		}
		controllers.locationController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Location controller");
		}
		controllers.miraclesController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Miracles controller");
		}
		controllers.eventClickController = function($scope) {
			// Take the Event Id

			// On delete button Click
			// Perform a delete service request
			// Update the calendar
		}
		controllers.calendarsController = function($scope,$compile,uiCalendarConfig, $http, $q, $modal) {
			var date = new Date();
		    var d = date.getDate();
		    var m = date.getMonth();
		    var y = date.getFullYear();

		    console.log("Nemam Amma Bhagavan Sharanam -- Date type" + new Date(y, m, d - 5) );
		    
		   
			/* event source that contains custom events on the scope */
			$scope.events = [];
			/* event sources array*/
		    
		    $scope.eventSources 	= [$scope.events];
	   		$scope.sources 			= "";
	   		$scope.source 			= "";

		    // Scope.event loaded from promise
		    $scope.promise = getEvents($q, $http);

		    $scope.promise.then(
				function(events) {
							// Load all the events 
							angular.forEach(events, function(event, eventIndex) {
 								$scope.events.push(event);
							});
						  	},
				function(err) { $scope.eventSources = "No Events"}
			)
			

		    /* Render Tooltip */
		    $scope.eventRender = function(event, element) {
     			/*console.log("Nemam Amma Bhagavan Sharanam");
     			 element.qtip({
          			  content: event.description
       			  });
				*/
    		};

		    $scope.eventClick = function( event, jsEvent, view) { 
		       // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
       			//alert('View: ' + view.name);
       			console.log("Nemam Amma Bhagavan Sharanam" + Object.keys(event));
       			$scope.event_id 	= event._id;
       			$scope.event_title 	= event.title 
       			console.log("Nemam Amma Bhagavan Sharanam -- ID of clicked event" + $scope.event_id);
		       var modalInstace = $modal.open({
		       		templateUrl: '/partials/eventClickModal.html',
		       		controller: 'eventClickController'
		       });

		        //alert("Nemam Amma Bhagavan Sharanam");
		    };
		    

			/* config object */
		    $scope.uiConfig = {
		      calendar:{
		        height: 650,
		        width: 450,
		        editable: false,
		        header:{
		          left: 'today prev,next',
		          center: 'title',
		          right: 'month,basicWeek,basicDay'
		        },
		        eventClick: $scope.eventClick,
		        eventDrop: $scope.alertOnDrop,
		        eventResize: $scope.alertOnResize,
		        eventRender: $scope.eventRender
		      }
		    };

		    /* Change View */
		    $scope.renderCalender = function(calendar) {
			    if(uiCalendarConfig.calendars[calendar]){
			        uiCalendarConfig.calendars[calendar].fullCalendar('render');
			    }
		    };

		    /* add and removes an event source of choice */
		    $scope.addRemoveEventSource = function(sources,source) {
		      var canAdd = 0;
		      angular.forEach(sources,function(value, key){
		        if(sources[key] === source){
		          sources.splice(key,1);
		          canAdd = 1;
		        }
		      });
		      if(canAdd === 0){
		        sources.push(source);
		      }
		    };

		    
   			 /* add custom event*/
		     $scope.addEvent = function() {
		     	//  1. Store new event in db
		     	// Simple POST request example (passing data) :
				$http.post('/api/addEvent', {
										title: $scope.newEventTitle,
										start: moment($scope.newEventStart).format('YYYY-MM-DD'),
										end: moment($scope.newEventEnd).format('YYYY-MM-DD'),
										allDay: false,
										url: ""
										})
				  .success(function(data, status, headers, config) {
				    // this callback will be called asynchronously
				    // when the response is available
				    console.log("Nemam Amma Bhagavan Sharanam -- Storing Data" + data + status);
	
				    $scope.events.push(data);

        			
				  })
				  .error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				  });
		     	
		    } // addEvent method 

			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Calendar controller");
		}
		controllers.resourcesController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Pujas controller");
		}
		controllers.contactController = function($scope) {
			console.log("Nemam Amma Bhagavan Sharanam -- Calling the Pujas controller");
		}

		app.controller(controllers); 

		function getEvents($q, $http) {
			var q = $q.defer();

			$http.get('/api/getEvents').
				success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
			    // 2. Render it in calendar
			    q.resolve(data);
				  			
    			// callback($scope.events);
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    // $scope.events = [{}];
			    q.reject("Nemam Amma Bhagavan Sharanam No data found");
			    
			  });

			 return q.promise
	     	
		}


