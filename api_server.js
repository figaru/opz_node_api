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
const MongoClient 	= require('mongodb').MongoClient;
const MongoDb 		= require('mongodb').Db;
const MongoServer	= require('mongodb').Server;

//system config file
const config = require('./config'); // get our config file
var args = process.argv.splice(2);

// =================================================================
// CONFIGURATION ===================================================
// =================================================================
//setup server listening port
var port = args[0] || 8010; // 8011

// use body parser so we can get info from POST and/or URL parameters
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(bodyParser.text());
// use morgan to log requests to the console
api.use(morgan('dev'));

// =================================================================
// Setup jobs Manager  =============================================
// =================================================================
/*const ai_server = require('./app/tcp/client');
ai_server.connect();*/
//job manager

const Job = require('./app/jobs');
// =================================================================
// CREATE API SERVER ===============================================
// =================================================================
MongoClient.connect(config.db.url, function(err, db) {
	if(db){
		//SETUP COLLECTIONS
		db.createCollection("logs");
		db.createCollection("userAI");
		db.createCollection("userApps");


		Job.init(db);

		//connected to DB -> setup api index
		require('./app/api').setup(api, db, Job);

		//start listening
		api.listen(port, () => {
			console.log('Opzio Api server hosted at http://localhost:' + port);
		});
	}else{
		console.log("mongo server is unreachable");
	}
	
});

/*api.listen(port, () => {
	console.log('Opzio Api server hosted at http://localhost:' + port);
});
*/

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