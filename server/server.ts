
import * as express 		from "express";
import * as bodyParser 		from "body-parser";
import * as cookieParser 	from "cookie-parser";
import * as methodOverride 	from "method-override";
import * as morgan 			from "morgan";
import * as path 			from "path";

import {SearchQueriesController} from "./controllers/searchQueriesController";
import {TweetsController} from "./controllers/tweetsController";
import { TweetTemplatesController }  from "./controllers/tweetTemplatesController";

 export class Server {
 	private port =		process.env.PORT || "9000";
 	private app: 		express.Application;


 	constructor() {

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

		this.app.use(express.static(__dirname + '/../public/twitteReach/dist'));                 // set the static files location /public/img will be /img for users
		this.app.use(morgan('dev'));                                         // log every request to the console
		this.app.use(bodyParser.json());                                     // parse application/json
		this.app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

		this.app.set('views', __dirname + '/../public/twitteReach/dist/');
		this.app.engine('html', require('ejs').renderFile);
		this.app.set('view engine', 'html');

		this.app.use(bodyParser.urlencoded({
		  extended: true
		}));

		
		this.app.get('/', (req, res) => res.render('index.html')); 

		// Routes
		SearchQueriesController.routes(this.app);
		TweetsController.routes(this.app);
		TweetTemplatesController.routes(this.app);


		this.app.listen(this.port, function () { 

			console.log("Nemam Amma Bhagavan Sharanam -- listening on port", this.port);
		});
 	}	

 }