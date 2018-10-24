"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const searchQueriesController_1 = require("./controllers/searchQueriesController");
const tweetsController_1 = require("./controllers/tweetsController");
const tweetTemplatesController_1 = require("./controllers/tweetTemplatesController");
class Server {
    constructor() {
        this.port = process.env.PORT || 5000;
        // Req parsing
        this.app = express();
        // 	this.app.use(express.static((path.join(__dirname, '../public/twitteReach/dist'))));         // set the static files location /public/img will be /img for users
        // this.app.use(morgan('dev'));                                         // log every request to the console
        // this.app.use(bodyParser.json());                                     // parse application/json
        // this.app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        // this.app.use(methodOverride());
        // this.app.use(cookieParser()); 										// read cookies (needed for auth)
        // // Template
        // this.app.set('views', (path.join(__dirname, '../public/twitteReach/dist')));
        // this.app.engine('html', require('ejs').renderFile);
        // this.app.set('view engine', 'html');
        this.app.use(express.static(__dirname + '/../public/twitteReach/dist')); // set the static files location /public/img will be /img for users
        this.app.use(morgan('dev')); // log every request to the console
        this.app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json()); // parse application/json
        this.app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        this.app.set('views', __dirname + '/../public/twitteReach/dist/');
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.get('/', (req, res) => res.render('index.html'));
        // Routes
        searchQueriesController_1.SearchQueriesController.routes(this.app);
        tweetsController_1.TweetsController.routes(this.app);
        tweetTemplatesController_1.TweetTemplatesController.routes(this.app);
        this.app.listen(this.port, function () {
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map