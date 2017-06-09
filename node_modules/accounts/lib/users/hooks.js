'use strict';

var debug = require('debug')('accounts');
var validator = require('../validator');

exports.pre = {
	create: function(appId, data) {
		debug('Creating a new user', appId, data);

		data = validator.create('users', data);

		return data;
	},
	update: function(appId, data) {
		debug('Updating a User...', data);

		data = validator.update('users', data);

		return data;
	}
};

exports.post = {
	create: function(result) {
		debug('Created user', result.username);
	},
	update: function(result) {
		debug('Updated a User...', result.id);
	}
};
