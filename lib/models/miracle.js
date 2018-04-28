var mongoose   		= require('mongoose'); // mongo db

// define model =================
 var Miracle = mongoose.model('Miracles', {
        name: 		String,
        date: 		String,
        location: 	String, 
        title: 		String,
        category: 	String,
        desc: 		String,
        username: 	String
 	});

module.exports = Miracle;