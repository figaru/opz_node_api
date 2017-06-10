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
		//GET
		app.all('/users/current');//get  current user profile
		app.all('/users/:id'); //get a specific users profile | ROLE VALIDATION REQUIRED
		app.all('/users/current/logs');//get current user heartbeats
		app.all('/users/:id/logs');//get current user heartbeats | ROLE VALIDATION REQUIRED
		//POST

	app.all('/users/*', validateAccess);
		app.all('/users/current'); 
		app.all('/users/:id'); //implement validateRoles


}

function validateAccess(req, res, next){
	if (!req.headers['x-access-token'] || !req.headers['x-user-id'] || !req.headers['x-app-id']){
		api.response(res, 401);
	}else{
		db.collection('userApps').findOne({'user_id': req.headers['x-user-id'], 'app_id': req.headers['x-app-id'], 'access_token': req.headers['x-access-token']}, 
		(err, appItem) => {
			if(err) {api.response(res, 500)};

			if(!appItem){
				api.response(res, 401);
			}else{
				next();
			}
		});
	}
};

function validateRoles(req, res, next){
	db.collection('userApps').findOne({'user_id': req.headers['x-user-id'], 'app_id': req.headers['x-app-id'], 'access_token': req.headers['x-access-token']}, 
	(err, appItem) => {
		if(err) {api.response(res, 500)};

		
	});
};