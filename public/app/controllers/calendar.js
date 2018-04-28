var app  = app;

app.controller('calendarsController', function($scope, Auth, $compile, uiCalendarConfig, $http, $q, $modal, flash) {
	
	$scope.events 					= []; 					// Initialize events
	$scope.eventSources 			= [$scope.events]; 		// View-model containing all the Event Sources

	$scope.start_times 				= ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00","6:00", "7:00", "8:00", "9:00", 
									   "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00","17:00", "18:00",
									   "19:00", "20:00", "21:00", "22:00", "23:00"]; // Select tag containing all the Hours in start date
	$scope.start_time_select 		= $scope.start_times[10];  // Selected Start Time
	$scope.end_times 				= ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00","6:00", "7:00", "8:00", "9:00",
									   "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", 
									   "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"]; // Select tag containing all the Hours in end date
	$scope.end_time_select 			= $scope.end_times[10];	  // Selected End Time

	// Name: View Render
	// Desc: On each view change get the events corresponding to the selected time
	$scope.viewRender = function(view, element) {
	    // remove old events
		$scope.events.splice(0, $scope.events.length);

		// Load events from mongo db
	    $scope.promise = getEvents($q, $http);
	    $scope.promise.then(
			function(events) {
					
						angular.forEach(events, function(event, eventIndex) {
								$scope.events.push(event);
						});
					},
			function(err) { $scope.eventSources = "No Events"}
			)
	}; // viewRender

	 // Name: Change View 
	 // Descr: Show the view for the current date
	$scope.changeView = function(view,calendar) {
	 	console.log("Nemam Amma Bhagavan Sharanam -- Changing view" )
		  uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	}; // changeView

    $scope.renderCalender = function(calendar) {
	    if(uiCalendarConfig.calendars[calendar]){
	        uiCalendarConfig.calendars[calendar].fullCalendar('render');
	    }
    };
    // Eender Tooltip
    $scope.eventRender = function(event, element) {
			/*console.log("Nemam Amma Bhagavan Sharanam");
			 element.qtip({
  			  content: event.description
			  });
		*/
		console.log("Nemam Amma Bhagavan Sharanam -- Adding event descr.");
		element.find('.fc-event-title').append("<br/>" + "Nemam Amma Bhagavan Sharanam"); 
	};

    $scope.eventClick = function( event, jsEvent, view) { 
       // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			//alert('View: ' + view.name);
			console.log("Nemam Amma Bhagavan Sharanam" + Object.keys(event));
			$scope.deleteEventId 	= event._id;
			$scope.deleteEventTitle = event.title;
        //alert("Nemam Amma Bhagavan Sharanam");
    };
    

	// config object 
    $scope.uiConfig = {
      calendar:{
        //height: 700,
        //width: 700,
        editable: false,
        allDaySlot: true,
        header:{
          left: 'today prev,next',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        viewRender: $scope.viewRender
      }
    };

	// add custom event
     $scope.addEvent = function() {
     	//  1. Store new event in db
     	var start_date_time = $scope.newEventStart.toString();
     		start_date_time = start_date_time.replace(/00:00:00/g, $scope.start_time_select);
     	var end_date_time = $scope.newEventEnd.toString().replace(/00:00:00/g, $scope.end_time_select);
		$http.post('/api/addEvent', {
								title: $scope.newEventTitle,
								start: moment(start_date_time).format(),
								end: moment(end_date_time).format(),
								allDay: false,
								url: "" 
								}) // $http.post
		  .success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log("Nemam Amma Bhagavan Sharanam -- Storing Data" + data + status);
		  
		     // Publish a success flash
    		flash.success = "Added new calendar Event!";
		    $scope.events.push(data);

			
		  }) // success promise
		  .error(function(data, status, headers, config) {
		  	flash.error = "Unable to add new calendar event!";
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  }); // Error promise 
     	
    } // addEvent method 

    // remove event
    $scope.deleteEvent = function() {
    	// Make API all to delete with id of the event
    	$http.delete('/api/deleteEvent/'+ $scope.deleteEventId)
	    	.success(function(data, status, headers, config) {

	    		// Update the calendar
	    		angular.forEach($scope.events, function(event, eventIndex) {
 					if (event._id == $scope.deleteEventId)
 					{
 						$scope.events.splice(eventIndex, 1);
 					}
				});
	    		console.log("Nemam Amma Bhagavan -- Deleted Event" + Object.keys(data).length);

	    	})
	    	.error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log("Nemam Amma Bhagava Sharanam -- Error in storing the event" + data);
			});

    } // deleteEvent

	console.log("Nemam Amma Bhagavan Sharanam -- Calling the Calendar controller");
}); // calendarController

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
