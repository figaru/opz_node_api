'use strict';

var debug = require('debug')('accounts');

exports.pre = {
	sync: function() {
		debug('Syncing accounts DB...');
	},
	drop: function(secret, options) {
		if (arguments.length < 2) {
			throw new Error('Invalid method arguments');
		}
		if (secret !== options.secret) {
			throw new Error('Secret argument is invalid!');
		}
	}
};

exports.post = {
	sync: function() {
		debug('Synced accounts DB');
	},
	drop: function() {
		debug('Accounts DB droped!');
	}
};
