var mongoose   		= require('mongoose'); // mongo db

// define model =================
 var Resource = mongoose.model('Resources', {
        name: 		String,
        date: 		String,
        title: 		String,
        topic: 		String,
        desc: 		String,
        username:   String
 	});

module.exports = Resource;