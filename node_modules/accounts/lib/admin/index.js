'use strict';

var storageBind = require('../storage_bind');
var hooks = require('./hooks');
var methods = require('./methods');

module.exports = function createAdmin(storage, options) {

	var client = {};

	storageBind(client, storage.admin, methods, hooks, options);

	return client;
};
