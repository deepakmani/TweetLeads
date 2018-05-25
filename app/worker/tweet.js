
module.exports =  function(queue) {
  // call process
  queue.process(5, function(job, done){
  	queue.getJob(job.jobId).then(function(job) {
  		console.log("ABS -- Progress" + job.progress());

  		// Prevent multiple jobs from being run due to locking
  		// Issue: https://github.com/OptimalBits/bull/issues/210
  		if (job.progress() == 0) {
  			send_tweet(job).then(function (objResult) {
				console.log(objResult);
			});
  		}
  	})
  }
}

function send_tweet(job) {
	job.data
}