"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const searchQueriesController_1 = require("./controllers/searchQueriesController");
const tweetsController_1 = require("./controllers/tweetsController");
class Server {
    constructor() {
        this.port = process.env.PORT || 5000;
        this.app = express();
        this.app.use(express.static((path.join(__dirname, '../public/twitteReach/dist')))); // set the static files location /public/img will be /img for users
        this.app.use(morgan('dev')); // log every request to the console
        this.app.use(bodyParser.json()); // parse application/json
        this.app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        this.app.set('views', (path.join(__dirname, '../public/twitteReach/dist')));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(methodOverride());
        this.app.use(cookieParser()); // read cookies (needed for auth)
        this.app.get('/', (req, res) => res.render('index.html'));
        searchQueriesController_1.SearchQueriesController.routes(this.app);
        tweetsController_1.TweetsController.routes(this.app);
        this.app.listen(this.port, function () {
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map