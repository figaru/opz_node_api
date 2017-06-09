'use strict';

var debug = require('debug')('accounts');
var validator = require('../validator');

exports.pre = {
	create: function(appId, data) {
		debug('Creating a new Field...', appId);

		data = validator.create('fields', data);

		return data;
	},
	update: function(appId, data) {
		debug('Updating a Field...', data);

		data = validator.update('fields', data);

		return data;
	}
};

exports.post = {
	create: function(result) {
		debug('Created a new Field', result.id);
	},
	update: function(result) {
		debug('Updated a Field', result.id);
	}
};
