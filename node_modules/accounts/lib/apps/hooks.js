'use strict';

var debug = require('debug')('accounts');
var validator = require('../validator');

exports.pre = {
	create: function(data) {
		debug('Creating a new App', data);

		data = validator.create('apps', data);

		return data;
	},

	update: function(data) {
		debug('Updating App', data);

		data = validator.update('apps', data);

		return data;
	}
};

exports.post = {
	create: function(result) {
		debug('Created App', result.name);
	},

	update: function(result) {
		debug('Updated App', result.name);
	}
};
