const Schema  = require("node-simple-schema");
const ObjectID = require('mongodb').ObjectID;
LogUpdateSchema = new Schema({
	"category": 	{type: String, optional: true},
	"project": 		{type: String, optional: true},
	"private": 		{type: Boolean, optional: true},
	"validated": 	{type: Boolean, optional: true},
});

BulkLogUpdateSchema = new Schema({
	"logs": {
		type: [Object],
		min: 2,
		minCount: 2,
		optional: false,
	},
	"logs.$.log_id": {type: String, optional: false},
	"logs.$.fields": {type: Object, optional: false},
}, { requiredByDefault: true });

const Dates = require('./../modules/dates');
var api;
var app;
var db;

module.exports = function(Api){
	app = Api.server;
  	db = Api.db;
  	api = Api;

  	//GET
  	//get todays logs for specific user
  	app.get('/users/:userid/logs', (req, res) => {
  		var user_id = req.params.userid;
  		var date = Dates.todayRange();

  		if(req.query.date){
  			date = Dates.dateRange(req.query.date);
  		}

  		//get specific user logs -> date range 
	    Logs.getLogs(res, user_id, date);
  	});

  	//PATCH UPDATES
  	//update log -> project, etc
  	app.patch('/users/:userid/logs/:logid/update', (req, res) => {
  		var user_id = req.params.userid;
  		var log_id = req.params.logid;
  		var body = req.body;

  		isValid = LogUpdateSchema.namedContext("logUpdateContext").validate(body);
		if(isValid) {
			Logs.updateLog(res, log_id, user_id, body);
			//api.response(res, 201, isValid);
		}else{
			//return error status code
			api.response(res, 400);
		}
  	});
  	app.patch('/users/:userid/logs/update', (req, res) => {
  		var user_id = req.params.userid;
  		var body = req.body;

		if(body.logs) {
			Logs.bulkUpdateLogs(res, user_id, body.logs);
			//api.response(res, 201, isValid);
		}else{
			//return error status code
			api.response(res, 400);
		}
  	});
}

var Logs = {
	getLogs: (res, user_id, date) =>{
		//retrieve heartbeats for date range
	    db.collection('logs').aggregate([
	        {
	            $match:{
	                user:   user_id,
	                createDate:{
	                    $gte: new Date(date.start),
	                    $lt: new Date(date.end),
	                },
	                //Only get logs with +1 second of time.
	                totalTime:{
	                        $gt: 2
	                },
	            }
	        },
		], function(err, result){
			if(err){ api.response(res, 500) }
			else{
				api.response(res, 200, result);
			}
			
		});
	},
	updateLog: (res, log_id, user_id, body) =>{
		db.collection('logs').update(
		   	{"_id": log_id },
		   	{"$set": body},
		   	function(err, result) {
	     		if(err){api.response(res, 500, err);}
	     		else{
	     			api.scheduleTrain(api.ai_server,user_id);
	     			api.response(res, 200, result);
	     		}
	   		}
		);
	},
	bulkUpdateLogs: (res, user_id, array) => {
		//small array size validation -> 2 required
		if(array.length > 1){
			var bulk = db.collection('logs').initializeOrderedBulkOp();
		    // Match and update only. Do not attempt upsert
		    for(var i = 0; i < array.length; i++){

		    	var item = array[i];

		    	if(item.log_id && item.fields){
		    		bulk.find({
				        "_id": item.log_id,
				    }).updateOne({
				        "$set": item.fields,
				    });
		    	}
		    }

		    bulk.execute(function (err, result) {
		        if(err){api.response(res, 500, err);}
		        else{
		        	api.scheduleTrain(api.ai_server, user_id);
		        	api.response(res, 200, result);
		        }
		    });
		}else{
			api.response(res, 400, "Min count of 2 logs required");
		}
	}
}