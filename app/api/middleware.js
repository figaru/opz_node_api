var api;
var app;
var db;

/*
	TODO: 
	1. Implement role validation for specified routes
	
*/

module.exports = function(Api){
	app = Api.server;
  	db = Api.db;
  	api = Api;
	// ---------------------------------------------------------
	// route middleware to authenticate and check token
	// ---------------------------------------------------------

	//set all users endpoint to require validation
	app.all('/users/*', validateAccess);
		//USER DETAILS
		//GET
		app.all('/users/:userid'); //get a specific users profile | ROLE VALIDATION REQUIRED
		//POST
		app.all('/users/:userid/heartbeat');//get current user heartbeats

		//USER LOGS
		//GET
		app.all('users/:userid/logs'); //get a specific users profile | ROLE VALIDATION REQUIRED
		//PATCH
		app.all('/users/:userid/logs/:logid/update', validateBody);//get current user heartbeats
		app.all('/users/:userid/logs/update', validateBody);//get current user heartbeats


}

function handleCurrent(req, res, next){
	console.log(req.headers);
	req.url = req.url.replace("current", req.headers['x-user-id']);
	next();
};

function validateAccess(req, res, next){
	console.log(req.headers);
	if (!req.headers['x-access-token'] || !req.headers['x-user-id'] || !req.headers['x-app-id']){
		api.response(res, 401);
	}else{
		db.collection('userApps').findOne({'user_id': req.headers['x-user-id'], 'app_id': req.headers['x-app-id'], 'access_token': req.headers['x-access-token']}, 
		(err, appItem) => {
			if(err) {api.response(res, 500)};

			if(!appItem){
				api.response(res, 401);
			}else{
				req.url = req.url.replace("current", req.headers['x-user-id']);
				next();
			}
		});
	}
};

function validateBody(req, res, next){
	if (!req.body){
		api.response(res, 400);
	}else{
		next();
	}
};

function validateRoles(req, res, next){
	db.collection('userApps').findOne({'user_id': req.headers['x-user-id'], 'app_id': req.headers['x-app-id'], 'access_token': req.headers['x-access-token']}, 
	(err, appItem) => {
		if(err) {api.response(res, 500)};

		
	});
};