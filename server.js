// =================================================================
// get the packages we need ========================================
// =================================================================

/*var debug = true;

var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

if(debug) elapsed_time("start send_html()");
console.log("running");
if(debug) elapsed_time("end send_html()");

if(debug) elapsed_time("start send_html()");
console.log("running");
if(debug) elapsed_time("end send_html()");
*/


var express 	= require('express');
var api         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
//var db 		    = require('mongoose');
var Mongo = require('mongodb').MongoClient;

var config = require('./config'); // get our config file

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 3030; // used to create, sign, and verify tokens
//api.set('serverSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// use morgan to log requests to the console
api.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
/*app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara', 
		password: 'password',
		admin: true 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});*/

/*// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);*/

// =================================================================
// start the server ================================================
// =================================================================

/*function apiOnBeforeHook (req, res, next) {
   if (req.method === 'GET') { 
     // Do some code
   }

   // keep executing the router middleware
   next()
}

app.use(myMiddleware)*/

//var User   = require('./app/models/user'); // get our mongoose model


Mongo.connect(config.db.url, function(err, db) {
	require('./app/api')(api, db);

	/*db.collection('userApps').findOne({}, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
      }
    });*/

	api.listen(port, () => {
		console.log('Magic happens at http://localhost:' + port);
	});
});
