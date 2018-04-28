var Twitter = require('twitter');

// Setup streams for each query

// Query
// SELECT q.query, user.consumer_key, user.consumer_secret, user.access_token_key, user.access_token_secret
// FROM User as user INNER JOIN DISTINCT
// (SELECT q.query, user.twitter_handle
//  FROM   Queries as q
// )  
// ON Queries.twitter_handle == User.twitter_handle


// For each query, setup a stream
for (var i = 0; i < users.length; i++)
{
    
   var client = new Twitter({
                        	consumer_key: '',
        			consumer_secret: '',
  				access_token_key: '',
  				access_token_secret: ''
		});
});

var stream = client.stream('statuses/filter', {track: 'javascript'});

stream.on('data', function(event) {
  console.log(event && event.text);
});
 
stream.on('error', function(error) {
  throw error;
});
