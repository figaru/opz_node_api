const Schema  = require("node-simple-schema");
const ObjectID = require('mongodb').ObjectID;
LogUpdateSchema = new Schema({
	"category": 	{type: String, optional: true},
	"project": 	{type: String, optional: true},
	"private": 		{type: Boolean, optional: true},
	"validated": 	{type: Boolean, optional: true},
});

const Dates = require('./../modules/dates');
var api;
var app;
var db;

module.exports = function(Api){
	app = Api.server;
  	db = Api.db;
  	api = Api;

  	//GET
  	//get todays logs for current user
  	app.get('/logs/current', (req, res) => {
  		var user_id = req.headers['x-user-id'];
  		var date = Dates.todayRange();  
		//get user logs -> date range 
	    Users.getLogs(res, user_id, date);
  	});
  	//get todays logs for specific user
  	app.get('/logs/:userid', (req, res) => {
  		var user_id = req.params.id;
  		var date = Dates.todayRange();
  		//get specific user logs -> date range 
	    Users.getLogs(res, user_id, date);
  	});

  	//POST
  	//update log -> project, etc
  	app.patch('/logs/current/log/:logid/update', (req, res) => {
  		var user_id = req.headers['x-user-id'];
  		var log_id = req.params.logid;
  		var body = req.body;

  		isValid = HeartbeatSchema.namedContext("logContext").validate(body);
		if(isValid) {
			Logs.updateLog(res, log_id, user_id, body);
			//api.response(res, 201, isValid);
		}else{
			//return error status code
			api.response(res, 400);
		}
  	});
}

var Logs = {
	updateLog: (res, log_id, user_id, body) =>{
		var Logs = db.collection('userApps');
		findAndModify(
		   	{ "_id": log_id },
		   	{ "$set": body },
		   	function(err, doc) {
	     		// work here
	     		if(err){console.log(err);}
	     		else{
	     			console.log(doc);
	     		}
	   		}
		);
	}
}