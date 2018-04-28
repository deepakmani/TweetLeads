
var mongoose   		= require('mongoose'); // mongo db

// define model =================
 var Event = mongoose.model('Events', {
        title : String,
        start: String,
        end: String,
        allDay: Boolean,
        url: String
 	});

module.exports = Event;