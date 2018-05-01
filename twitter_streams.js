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

 var client = new Twitter({
                        	consumer_key: '2i9EW8WkyIEr7ZwR9oO4KZWUU',
        			consumer_secret: 'V95tZ7T6Ed3Q1LnokwrxSSir7vKzR7RtQKgsmSjKYFHCccyC9s',
  				access_token_key: '1724608555-2AfqipBQ2ziRnex51pJeLEncBlsehxn9OcqTwDS',
  				access_token_secret: 'IvbzE2Ngob3AQeuTBJ5J3Uv8m3sbJHb0fzXsi3hKxCjzN'
		});

client.stream('statuses/filter', {track: '(linkedin premium) OR (Sales navigator) OR (Cold Calling)'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

 
stream.on('error', function(error) {
  throw error;
});
});

