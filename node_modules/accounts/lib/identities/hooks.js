'use strict';

var debug = require('debug')('accounts');
var validator = require('../validator');

exports.pre = {
	create: function(appId, data) {
		debug('Creating a new Identity...', appId);

		data = validator.create('identities', data);

		return data;
	},
	update: function(appId, data) {
		debug('Updating a Identity...', data);

		data = validator.update('identities', data);

		return data;
	}
};

exports.post = {
	create: function(result) {
		debug('Created a new Identity', result.id);
	},
	update: function(result) {
		debug('Updated a Identity', result.id);
	}
};
