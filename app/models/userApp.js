var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('UserApps', new Schema({ 
	user_id: String, 
	app: String, 
	app_id: String,
	refresh_token: String,
	access_token: String,  
	access_expire: Date,
	update_date: Date,
	create_date: Date
}, { collection : 'userApps' }));