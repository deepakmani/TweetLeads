// Event model
var Event 	 = require("./models/event");
var Miracle  = require ("./models/miracle");
var Resource = require ("./models/resource");

module.exports = function(app, passport) {
	  // Get method
	app.get('/', function(req, res) {
		console.log('Nemam Amma Bhagavan Sharanam -- Is the user authenticated?' + req.user);
		//res.render('index.html'); 
	});


	// routes for MONGO DB access
	app.get('/api/getEvents', function(req, res) {

	    // use mongoose to get all events in the database
	    Event.find(function(err, events) {

	        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
	        if (err) res.send(err)

	        else res.json(events); // return all events in JSON format
	    });
	});


	// create event and send back all events after creation
	app.post('/api/addEvent', function(req, res) {

		console.log("Nemam Amma Bhagavan Sharanam -- Storing - start" + req.body.start + " - end - " + req.body.end + " User: " +  req.user);
		
	    // Store an event in MongoDB, information comes from AJAX request from Angular
	    Event.create({
	        title : req.body.title,
	        start: req.body.start,
	        end: req.body.end,
	        allDay: req.body.allDay,
	        url: req.body.url,
	        description: req.body.description
	    }, function(err, event) {
	        if (err) res.send(err);        
	        else 
	        {
	        	res.json(event);
	        	console.log("Nemam Amma Bhagavan Sharanam -- Adding Event Start Time" + event.start);
	        } // added Event send response 
	        //});
	    }); // Event.create

	}); // addEvent POST route

	// Name: Delete an Event using Event Id
	// Descr: Remove the event and send the status response
	app.delete('/api/deleteEvent/:id', function(req, res) {
		console.log("Nemam Amma Bhagavan Sharanam -- Id:" + req.params.id);
		// Remove the Event using id parameter from the endpoint
		Event.remove({
			_id: req.params.id
		}, function(err, event) {
	 
		if (err) return res.send(err);
		
	    else res.json({ message: 'Successfully deleted' });

	  }); // Event.remove - Mongoose call

	}); // app.delete

	// Name: Session Post Route - Login to the site 
 	// Descr: Call the passport.authenticate method and redirect accordingly
	 app.post('/api/auth/session', function(req, res, next) { 
	 	
	 	passport.authenticate('local-login', function(err, user, info) {
    		var error = err || info;
    		console.log("Nemam Amma Bhagavan Sharanam -- User is" + user.name);
   
	    	if (error) { 
	    		console.log("Nemam Amma Bhagavan Sharanam -- error in post");
	    		return res.json({error: error}); 
	    	} // error
    		//req.logIn(user, function(err) {
   		    // 	if (err) return res.send(err); 
   		    // 	console.log("Nemam Amma Bhagavan Sharanam -- User is" + user);
			  	res.json({user: user});
		//	}); // logIn
    	 })(req, res, next); // passport.authenticate
	}); // session route

	 // Name: AddMiracle
	 // Descr: Store Miracle into mongo db

	 app.post('/api/addMiracle', function(req, res) {
		
	    // Store an event in MongoDB, information comes from AJAX request from Angular
	    Miracle.create({
	    	name: 		req.body.name,
	    	date: 		req.body.date,
	    	location: 	req.body.location,
	    	category: 	req.body.category,
	        title: 		req.body.title,
	        desc: 		req.body.desc,
	        username: 	req.body.username 
	      
	    }, function(err, miracle) {
	        if (err) res.send(err);        
	        else 
	        {
	        	// return miracle object
	        	res.json(miracle);
	        	console.log("Nemam Amma Bhagavan Sharanam -- Adding Miracle for date:" + miracle.date + miracle.title + req.body.name);
	        } 
	        //});
	    }); // Miracle.create
	}); // addMiracle POST route 
	 

	app.get('/api/getMiracles', function(req, res) {

		console.log("Nemam Amma Bhagavan Sharanam -- Items to be limited" + req.query.itemsPerPage);
	    // use mongoose to get all miracles in the database
	    Miracle.count({}, function(err, count){
   			Miracle.find({})
   				   	.limit(req.query.itemsPerPage)
   				   	.skip(req.query.itemsPerPage * (req.query.currentPage - 1))
  				  	.sort({ date: 'desc' })
   					.exec(function(err, miracles) {

		        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
		        if (err) res.send(err)

		        else res.json({count: count, miracles: miracles}); // return all events in JSON format
	   		}); // Miracle.find
		}) // Miralce.count
	
	}); // app.get miracles


	// Name: Delete a list of miracles using Miracle Id
	// Descr: Remove each miralce from mongo db
	app.delete('/api/deleteMiracles', function(req, res) {

		var miraclesToDelete = (req.query.count == 1) ? [req.query.miraclesToDelete] : req.query.miraclesToDelete;
		console.log("Nemam Amma Bhagavan Sharanam -- Deleting" + miraclesToDelete.length);
		for (i = 0; i < miraclesToDelete.length; i++)
		{	
			Miracle.remove({
				_id: miraclesToDelete[i]
			}, function(err, event) {
	 	
				if (err) return res.send(err);
			}); // Miracle.remove - Mongoose cal;
		}

	   	res.json({ message: 'Successfully deleted' });
	}); // app.delete

	 // Name: AddResource
	 // Descr: Store Resource into mongo db

	 app.post('/api/addResource', function(req, res) {
		
	    // Store an event in MongoDB, information comes from AJAX request from Angular
	    Resource.create({
	    	date: 		req.body.date,
	    	topic: 		req.body.category,
	        title: 		req.body.title,
	        desc: 		req.body.desc,
	        username: 	req.body.username 
	      
	    }, function(err, resource) {
	        if (err) res.send(err);        
	        else 
	        {
	        	// return resource object
	        	res.json(resource);
	        	console.log("Nemam Amma Bhagavan Sharanam -- Adding Resource for date:" + resource.date + resource.title);
	        } 
	        
	    }); // Resource.create
	}); // addResource POST route 
	
	app.get('/api/getResources', function(req, res) {

		console.log("Nemam Amma Bhagavan Sharanam -- Items to be limited" + req.query.itemsPerPage);
	    // use mongoose to get all miracles in the database
	    Resource.count({}, function(err, count){
   			Resource.find({})
   				   	.limit(req.query.itemsPerPage)
   				   	.skip(req.query.itemsPerPage * (req.query.currentPage - 1))
  				  	.sort({ date: 'desc' })
   					.exec(function(err, resources) {

		        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
		        if (err) res.send(err)

		        else res.json({count: count, resources: resources}); // return all events in JSON format
	   		}); // Resource.find
		}) // Resource.count
	
	}); // app.get resources

	// Name: Delete a list of resources using Resource Id
	// Descr: Remove each resource from mongo db
	app.delete('/api/deleteResources', function(req, res) {

		var resourcesToDelete = (req.query.count == 1) ? [req.query.resourcesToDelete] : req.query.resourcesToDelete;
		console.log("Nemam Amma Bhagavan Sharanam -- Deleting" + resourcesToDelete.length);
		for (i = 0; i < resourcesToDelete.length; i++)
		{	
			Resource.remove({
				_id: resourcesToDelete[i]
			}, function(err, event) {
	 	
				if (err) return res.send(err);
			}); // Resource.remove - Mongoose cal;
		}

	   	res.json({ message: 'Successfully deleted' });
	}); // app.delete

} // Module.exports


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
