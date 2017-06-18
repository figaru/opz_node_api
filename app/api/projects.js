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
  	//get projects for specific user
  	app.get('/users/:userid/projects', (req, res) => {
  		var user_id = req.params.userid;
  		
  		Projects.getProjects(user_id, function(err, data){
  			if(err){ api.response(res, 400); }
  			else{
  				api.response(res, 200, data);
  			}
  		});
  		//console.log(projects);
  	});
}


var Projects = {
	getProjects: function(userid, callback){
		db.collection('users').findOne({_id: userid}, function(err, data){
			if(err){ callback(err, null);}
			else if(data){
				var projects = [];
				var res = [];
				for(var i = 0; i < data.projects.length; i++){
					projects.push(data.projects[i].project);
				}

				db.collection('projects').find(
				{_id: 
					{
			        	$in: projects
			    	}
			    }).toArray( function(err, items){
			    	if(err){ callback(err, null); }
			    	else{
			    		//console.log(items);
		    			items.forEach(function(item){
		    				res.push({project: item._id, git_name: item.gitName, name: item.name});
		    			});
		    			callback(null, res);
			    	}
			    });

			}else{
				callback("failed.", null);
			}
		});

	}
}