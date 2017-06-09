var _sha = require('../packages/sha256');
var _crypt = require('../packages/secure');

var _bcrypt = require('bcrypt');
var _random = require('meteor-random');

const SimpleSchema  = require("node-simple-schema");

var db;

module.exports = {
	setup: function(database){
		db = database;
	},
	generateRandomToken: function(){
		return _random.secret();
	},
	generateObjToken: function(data){
		return _crypt.encrypt(data);
	},
	checkPassword: function(pass, bcrypt_pass){
		return new Promise(function(resolve, reject){
			_bcrypt.compare(_sha(pass), bcrypt_pass, function(err, result){
        		if(err) reject();

	        	resolve(result);
	      	});
		});
	},
	isValidAccess: function(headers){
		return new Promise(function(resolve, reject){
			if (!headers['x-access-token'] || !headers['x-user-id'] || !headers['x-app-id'])
				resolve(false);

			db.collection('userApps').findOne({'user_id': headers['x-user-id'], 'app_id': headers['x-app-id'], 'access_token': headers['x-access-token']}, (err, appItem) => {
				if(err){ console.log(err); reject(err) };

				if(appItem)
					resolve(true);

				resolve(false);
			});
		});
	}
}