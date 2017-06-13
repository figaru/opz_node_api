const authRoutes = require('./oauth');
const userRoutes = require('./users');
const logsRoutes = require('./logs');
const middleware = require('./middleware');

var _sha = require('../modules/sha256');
var _crypt = require('../modules/secure');

var _bcrypt = require('bcrypt');
var _random = require('meteor-random');

const codeStatus = {
	"200": "Ok",
	"201": "Created",
	"202": "Accepted",
	"204": "Succeeded No Data",
	"400": "Bad Request",
	"401": "Unauthorized",
	"403": "Forbidden",
	"404": "Not Found",
	"405": "Method Not Allowed",
	"500": "Server Error",
}

const codeReason = {
	"200": "The request has succeeded.",
	"201": "The request has been fulfilled and resulted in a new resource being created.",
	"202": "The request has been accepted for processing, but the processing has not been completed.",
	"204": "The request has succeeded, no data available",
	"400": "The request is invalid.",
	"401": "The request requires authentication, or your authentication was invalid.",
	"403": "You are authenticated, but do not have permission to access the resource.",
	"404": "The resource does not exist.",
	"405": "The method is not allowed for requested URL",
	"500": "Service unavailable, try again later.",
}


module.exports = {
	server: null,
	db: null,
	setup: function(server, db){
		//API GLOBAL CONSTANTS
		this.server = server;
		this.db = db;
		
		//------------------------------
		// MIDDLEWARE
		//------------------------------
	  	middleware(this);

	  	//------------------------------
	  	// ROUTES
	  	//------------------------------
	  	authRoutes(this);
	  	userRoutes(this);
	  	logsRoutes(this);
	},
	generateRandomToken: function(){
		return _random.secret();
	},
	//generate token based on data -> encrypted
	generateObjToken: function(data){
		return _crypt.encrypt(data);
	},
	//check if pass enter by user matched bcrypt account password
	checkPassword: function(pass, bcrypt_pass){
		return new Promise(function(resolve, reject){
			_bcrypt.compare(_sha(pass), bcrypt_pass, function(err, result){
        		if(err) reject();

	        	resolve(result);
	      	});
		});
	},
	response: function(res, code, data){
		//create response data
		var resp = {
			statusCode: code,
			body: {
				status: codeStatus[code],
				reason: codeReason[code],
			}
		};
		//if data exists -> add to response body object
		if(data && typeof data != "undefined"){
			resp.body.data = data;
		}	
		return res.status(code).json(resp);
	},

};