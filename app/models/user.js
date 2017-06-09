var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Users', new Schema({ 
	"emails.address": String, 
	"services": Object, 
	pass: String, 
	admin: Boolean 
}, { collection : 'users' }));