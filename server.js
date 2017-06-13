// =================================================================
// Required Packages/Modules =======================================
// =================================================================
//express http plugin
const express		= require('express');
const api			= express();
//http body parser
const bodyParser 	= require('body-parser');
//http request logger
const morgan		= require('morgan');
//get mongo plugin
const Mongo 		= require('mongodb').MongoClient;

//system config file
const config 		= require('./config'); // get our config file

// =================================================================
// CONFIGURATION ===================================================
// =================================================================
//setup server listening port
var port = process.env.PORT || 3030;

// use body parser so we can get info from POST and/or URL parameters
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(bodyParser.text());
// use morgan to log requests to the console
api.use(morgan('dev'));

// =================================================================
// SERVER ==========================================================
// =================================================================
Mongo.connect(config.db.url, function(err, db) {
	if(db){
		//connected to DB -> setup api index
		require('./app/api').setup(api, db);

		//start listening
		api.listen(port, () => {
			console.log('Opzio Api server hosted at http://localhost:' + port);
		});
	}else{
		console.log("mongo server is unreachable");
	}
	
});


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