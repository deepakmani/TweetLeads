var chai 					= require('chai').expect;
var rewire 					= require('rewire');
var db 						= require("../../dist/db.js");
var SearchQueriesController = require("../../dist/controllers/searchQueriesController.js");


describe("SearchQueriesController", () => {
   

   	describe("Save Search Queries", function() {
		// BeforeEach
		beforeEach(() => {
			// 1. Clean the test database
			
			// 2. Add a stub
			this.search_twitter_stub = sinon.stub(TwitterSearchStreams, "search_twitter").resolves({});
		})

		// TestCase
    	it('can be initialized without an initializer', (done) => {


    		// 1. Send req parameters
    		let req = {
    				body: {
    						new_search_queries: 
    						[{
    							keyword: 	"Nemam Amma Bhagavan Sharanam", 
    							screen_name: "DeepakABS",
    							category: 	 "Test"

    						}],
    						auto_search_twitter: false
    					}
    			 };

    	let search_twitter_promise_spy = sinon.spy();
			 
    	let res = {
    					json: function(data) {
    								// 1. Output
    								expect(data).to.deep.equal({status:true});
    								
    								// 2. Control flow
    								expect(this.search_twitter_stub).to.not.have.been.called;
    								
    								// 3. Data
    								db["SearchQueries"].find({where: {screen_name: "DeepakABS", category: "Test"}})
    								.then((search_queries) => {

    									expect(search_queries.length).to.equal(1);
    									expect(search_query.createdAt).to.not.be.empty;
    								})
    								done();
    				}
    	}		 
    			 
        addNewSearchQueries(req, res);
    });
});