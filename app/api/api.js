var _sha = require('../packages/sha256');
var _crypt = require('../packages/secure');

var _bcrypt = require('bcrypt');
var _random = require('meteor-random');

var TokenManager    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
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
		if (typeof headers['opz-access-token'] === 'undefined' || typeof headers['opz-client-id'] === 'undefined' || typeof headers['opz-app-id'] === 'undefined')
			return false;
	}
}