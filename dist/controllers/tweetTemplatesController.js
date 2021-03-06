"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/db");
class TweetTemplatesController {
    constructor(app) {
        // Setup routes
        //this.routes(app)
    }
}
TweetTemplatesController.routes = function (app) {
    app.get("/api/getTweetTemplates", this.getTweetTemplates);
    app.post("/api/saveTweetTemplate", this.saveTweetTemplate);
    app.post("/api/saveTweetTemplateSearchQuery", this.saveTweetTemplateSearchQuery);
};
TweetTemplatesController.getTweetTemplates = function (req, res) {
    let screen_name = req.query.screen_name;
    db.sequelize.query("SELECT  * \
	    				    FROM \"tweetTemplates\" \
	    				    WHERE screen_name='" + screen_name + "' \
	    				    ", { type: db.sequelize.QueryTypes.SELECT })
        .then((tweet_templates) => {
        res.json(tweet_templates);
    });
};
/*
    @name:  	saveTweetTemplate
    @params: 	screen_name, tweetTemplate
    @descr:		For given user take tweetTemplate and save it or update it

*/
TweetTemplatesController.saveTweetTemplate = function (req, res) {
    let tweetTemplate = req.body.tweet_template;
    let screen_name = req.body.screen_name;
    db["tweetTemplate"].upsert(tweetTemplate, { where: { screen_name: screen_name } })
        .then(function (test) {
        if (test) {
            res.status(200);
            res.send("Successfully stored");
        }
        else {
            res.status(200);
            res.send("Successfully inserted");
        }
    });
};
TweetTemplatesController.saveTweetTemplateSearchQuery = function (req, res) {
    let tweetTemplate = req.body.tweet_template;
    let screen_name = req.body.screen_name;
    db["tweetTemplate"].upsert(tweetTemplate, { where: { screen_name: screen_name } })
        .then(function (tweet_template) {
        res.json(tweet_template);
    }).catch(() => {
        res.json([]);
    });
};
exports.TweetTemplatesController = TweetTemplatesController;
//# sourceMappingURL=tweetTemplatesController.js.map