const Dates = require('./../modules/dates');
var api;
var app;
var db;

module.exports = function(Api){
	app = Api.server;
  	db = Api.db;
  	api = Api;

  	//---------------- PROFILE ----------------
  	app.get('/users/current', (req, res) => {
  		var user_id = req.headers['x-user-id'];
	    //get user profile
	    Users.getProfile(res, user_id);
  	});
  	app.get('/users/:id', (req, res) => {
  		var user_id = req.params.id;
	    //get user profile
	    Users.getProfile(res, user_id);
  	});
  	//end profile

  	//---------------- HEARTBEATS ---------------
  	//GET
  	app.get('/users/current/logs', (req, res) => {
  		var user_id = req.headers['x-user-id'];
  		var date = Dates.todayRange();  
		//get user logs -> date range 
	    Users.getLogs(res, user_id, date);
  	});
  	app.get('/users/:id/logs', (req, res) => {
  		var user_id = req.params.id;
  		var date = Dates.todayRange();
  		//get specific user logs -> date range 
	    Users.getLogs(res, user_id, date);
  	});
  	//POST
  	app.post('/users/current/logs', (req, res) => {
  		var user_id = req.headers['x-user-id'];
  		
  	});
  	//end heartbeats
}

var Users = {
	getProfile: (res, user_id) => {
		db.collection('users').findOne({"_id": user_id}, (err, user) => {
	    	if(err) api.response(res, 500);

	    	if(!user)
	    		api.response(res, 404);

	    	api.response(res, 200, user.profile); 
	    });
	},
	getLogs: (res, user_id, date) => {
		//retrieve heartbeats for date range
	    db.collection('userLogs').aggregate([
	        {
	            $match:{
	                user:   user_id,
	                createDate:{
	                    $gte: new Date(date.start),
	                    $lt: new Date(date.end),
	                },
	                //Only get logs with +1 second of time.
	                totalTime:{
	                        $gt: 5
	                },
	            }
	        },
		], function(err, results){
			if(err){ api.response(res, 500) };
			
			api.response(res, 200, results);
		});
	}
}