'use strict';

var storageBind = require('../storage_bind');
var hooks = require('./hooks');
var methods = require('./methods');

/**
 * Creates a new Users object.
 * @constructs Users
 * @param  {Storage} storage - A Storage instance.
 * @param  {String} appId - An applicatin id
 * @param  {AppOptions} [options] App options.
 * @return {Users}
 */
module.exports = function createUsers(storage, appId, options) {

	/**
	 * Users object
	 * @lends Users
	 */
	var client = {};

	storageBind(client, storage.users, methods, hooks, options, appId);

	return client;
};
