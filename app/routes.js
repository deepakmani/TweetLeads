// Event model
var db = require("./models/index");

var SearchQueriesController = require("./controllers/searchQueriesController.js")(db);
module.exports = function(app, passport) {
	  // Get method
	 app.get('/', function(req, res) {
	       res.render('index.html'); 
	  });


	// routes for MONGO DB access
	app.get('/api/getSearchQueries', SearchQueriesController.getSearchQueries);
	
	app.post('/api/addNewSearchQueries', SearchQueriesController.addNewSearchQueries);

	app.get('/api/getTweetsBySearchQuery', SearchQueriesController.getTweetsBySearchQuery);


	// create event and send back all events after creation
	app.post('/api/addEvent', function(req, res) {

		console.log("Nemam Amma Bhagavan Sharanam -- Storing - start" + req.body.start + " - end - " + req.body.end);
	    // Store an event in MongoDB, information comes from AJAX request from Angular
	    Event.create({
	        title : req.body.title,
	        start: req.body.start,
	        end: req.body.end,
	        allDay: req.body.allDay,
	        url: req.body.url,
	        description: req.body.description
	    }, function(err, event) {
	        if (err)
	            res.send(err);
	        else 
	        {
	        	res.json(event);
	        	console.log("Nemam Amma Bhagavan Sharanam -- Adding Event Start Time" + event.start);
	        } 
	        //});
	    });

	});

	app.delete('/api/deleteEvent/:id', function(req, res) {
		console.log("Nemam Amma Bhagavan Sharanam -- Id:" + req.params.id);
		Event.remove({
			_id: req.params.id
		}, function(err, event) {
	 

		if (err) {
		  return res.send(err);
		}
		
	    res.json({ message: 'Successfully deleted' });
	  });
	});

	 app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
