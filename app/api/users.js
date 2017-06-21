const Schema  = require("node-simple-schema");
const ObjectID = require('mongodb').ObjectID;
HeartbeatSchema = new Schema({
	"uri": 			{type: String, label:"url, path, etc"},
	"title": 		{type: String, label:"title of the application, page etc"},
	"domain": 		{type: String, label:"app, domain"},
	"plugin":		{type: String, label:"chrome, windows, mac, android..."},
	"timestamp": 	{type: Number, label:"unix timestamp"},
	"cursorpos": 	{type: Number, optional: true},
	"geopos": 		{type: Number, optional: true},
	"debug": 		{type: Boolean, optional: true},
});

const Dates = require('./../modules/dates');

var api;
var app;
var db;

module.exports = function(Api){
	app = Api.server;
  	db = Api.db;
  	api = Api;

  	//---------------- PROFILE ----------------
  	app.get('/users/:userid', (req, res) => {
  		var user_id = req.params.userid;
  		console.log(user_id);
	    //get user profile
	    Users.getProfile(res, user_id);
  	});
  	//end profile

  	//---------------- HEARTBEATS ---------------
  	//POST
  	app.post('/users/:userid/heartbeat', (req, res) => {
  		var user_id = req.headers['x-user-id'];
  		var body = req.body;

  		isValid = HeartbeatSchema.namedContext("heartbeatContext").validate(body);
  		//console.log(isValid);
		if(isValid) {
			Users.createLog(res, user_id, body);
			//api.response(res, 201, isValid);
		}else{
			//return error status code
			api.response(res, 400);
		}
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
	createLog: (res, user_id, heartbeat) => {
		//console.log(heartbeat);
		//Get user based on received token
		db.collection('users').findOne({"_id": user_id}, (err, user) => {
	    	if(err) api.response(res, 500);

	    	if(!user){
	    		api.response(res, 404);
	    	}else{
	    		updateUserTracker(user, heartbeat);
		    	//TODO: get user that is also set as active (not deleted or deactivated by organization admin)
				//Get or Update user tracking settings, then pass to queue accordingly
				//var proceed = updateUserTracker(user, heartbeat);
				var Heartbeats = db.collection('heartbeats');
				Heartbeats.findOne({user: user_id}, function(err, item) {
					//insert latest timestamp
					Heartbeats.update(
						{user: user_id}, 
						{$set: {timestamp: new Date()}}, 
						{upsert: true}
					);
					if(item){
						//check if last activity < 2 minutes ago
						var diff = Dates.timeDiff(item.timestamp, heartbeat.timestamp);
						var currentHour = Dates.getHour(heartbeat.timestamp);

						console.log("heartbeat can be logged");
						var matchQuery = {
							'user': user._id,
							'organization': user.profile.organization,
							'logHour': {
								$gte: new Date(currentHour)
							},
							'title': heartbeat.title,
							'uri': heartbeat.uri,
							'domain': heartbeat.domain,
							'plugin': heartbeat.plugin,
						};

						var insert = {
							'_id': new ObjectID().toString(),
							'user': user._id,
							'organization': user.profile.organization,
							'uri': heartbeat.uri,
							'title': heartbeat.title,
							'domain': heartbeat.domain,
							'plugin': heartbeat.plugin,
							'createDate': new Date(),
							'logHour': new Date(currentHour),
							'matchedProjects': [],
							'private': true,
							'validated': false,
							'classified': false,
							'relatedLog': "",
							'billed': false,
							'hourRate': 0
								//'viewable': true
						}

						var update = {
							'$set':{
								'updateDate': new Date()
							},
							'$setOnInsert': insert
						};

						if(diff < 60*2){
							update['$inc'] = { 'totalTime': diff };
						}else{
							update['$inc'] = { 'idleTime': diff };
						}

						//console.log(updatePipeline);
					classifyLog(user._id, heartbeat).then(function(result){
						update['$set'] = {
							'updateDate': new Date(),
							'project': result,
						};

						db.collection('logs').update(
							matchQuery, 
							update,
							{upsert: true},
							function(err, data){
								if(err){ console.log(err);}
								else{
									console.log("Heartbeat saved!");
									api.response(res, 201);
								}
								
							}
						);
						// }
					});

					
						//api.response(res, 201);

					}else{
						//insert latest timestamp
						api.response(res, 200, "started activity");
					}
				});
	    	}

	    	
			
	    });
	},
}

var updateUserTracker = function(user, heartbeat){
	if(!user.profile.hasTracker){
		console.log('update trackers for ' + user._id)
		db.collection('users').update({
			_id: user._id
		},
		{
			$set:{
				'profile.hasTracker': true
			}
		});
	}
	else{
		db.collection('users').findOne({
			_id: user._id,
			'trackers.tracker': heartbeat.plugin,
		}, function(err, userObj){
			if(userObj){
				var trackerSetting = userObj.trackers.filter(function( obj ) {
					return obj.tracker === heartbeat.plugin;
				});

				if(trackerSetting.length > 0){
					if(trackerSetting[0].active){
						db.collection('users').update({
							_id: user._id,
							'trackers.tracker': heartbeat.plugin,
						},
						{
							$set:{
								'trackers.$.updateDate': new Date(),
							}
						});
					}
				}
				else{
					db.collection('users').update({
						_id: user._id,
					},
					{
						$push:{
							'trackers':{
								'tracker':	heartbeat.plugin,
								'updateDate': new Date(),
								'createDate': new Date(),
								'active': true
							}
						}
					});
				}

			}
			else{
				db.collection('users').update({
					_id: user._id,
				},
				{
					$push:{
						'trackers':{
							'tracker':	heartbeat.plugin,
							'updateDate': new Date(),
							'createDate': new Date(),
							'active': true
						}
					}
				});
			}
		});

	}
}