var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    	local       	: {
	        username		: { 
	        					type: String, 
	        					unique: true, 
	        					required: true
	        				} // username members

	        password		: {
	        					type: 		String,
	        					unique: 	true,
	    						required: 	true
	    					} // password members
   		 } // local schema
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// authenticate user
userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
