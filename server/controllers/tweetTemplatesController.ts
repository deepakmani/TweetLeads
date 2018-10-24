import * as express 		from "express";
import * as db 				from "../models/db";

export class TweetTemplatesController {
	constructor(app: express.Application) {
		// Setup routes
		//this.routes(app)
	}

    
	public static routes = function(app) {
		app.get("/api/getTweetTemplates", this.getTweetTemplates);
		app.post("/api/saveTweetTemplate", this.saveTweetTemplate);
		app.post("/api/saveTweetTemplateSearchQuery", this.saveTweetTemplateSearchQuery);
	
	}

	public static getTweetTemplates = function(req, res) {
		let screen_name = req.query.screen_name;


	    db.sequelize.query("SELECT  * \
	    				    FROM \"tweetTemplates\" \
	    				    WHERE screen_name='" + screen_name + "' \
	    				    ",
	   { type: db.sequelize.QueryTypes.SELECT})
	    .then((tweet_templates) => {
	    	
			res.json(tweet_templates); 					
		});

	}

	/*
		@name:  	saveTweetTemplate
		@params: 	screen_name, tweetTemplate
		@descr:		For given user take tweetTemplate and save it or update it

	*/
	public static saveTweetTemplate = function(req, res) {

		let tweetTemplate  		= req.body.tweet_template;
		let screen_name  		= req.body.screen_name;

		db["tweetTemplate"].upsert(tweetTemplate, {where: {screen_name: screen_name}})
		.then(function (test) {
		    if(test){
		        res.status(200);
		        res.send("Successfully stored");
		    }else{
		        res.status(200);
		        res.send("Successfully inserted");
		    }
		});
	}

	public static saveTweetTemplateSearchQuery = function(req, res) {

		let tweetTemplate  		= req.body.tweet_template;
		let screen_name  		= req.body.screen_name;

		db["tweetTemplate"].upsert(tweetTemplate, {where: {screen_name: screen_name}})
		.then(function (tweet_template) {
		        res.json(tweet_template);
		}).catch(() => {
			res.json([]);
		})
	}
}		
		