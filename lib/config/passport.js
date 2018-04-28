var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

module.exports = function(passport) {
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Name: Local login authenticate method
    // Descr: Called by login route to send the username and password and
    //        check if it exists in mongodb
	passport.use('local-login', new LocalStrategy({
		username: 			'username',
		password: 			'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback

	},
	function(req, username, password, done) { // callback with username and password from our form
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        console.log("Nemam Amma Bhagavan Sharanam -- Calling passport.authenticate" + username + " "  + password);
        if (username == "admin" && password == "ammabhagavan") 
        {
        	var user = {
        					name: 		username
        				};
        	return done(null, user);
        }
  		else if (username == "srikanth.m" && password == "ammabhagavan")
  		{
  			var user = {
        					name: 		username
        				}        			
        	return done(null, user);
        }
        else if (username == "deepak.m" && password == "ammabhagavan")
  		{
  			var user = {
        					name: 		username
        				}        			
        	return done(null, user);
        }
        else console.log("Nemam Amma Bhagavan Sharanam -- Error in calling passport.authenticate");


    })); // callback for local-login
} // module.exports
