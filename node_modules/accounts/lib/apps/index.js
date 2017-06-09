'use strict';

var storageBind = require('../storage_bind');
var hooks = require('./hooks');
var methods = require('./methods');

/**
 * Creates an Apps object
 * @constructs Apps
 * @param  {Storage} storage - A Storage object
 * @param  {ClientOptions} [options] - Client options
 * @return {Apps}
 */
module.exports = function createApps(storage, options) {

	/**
	 * Apps object
	 * @lends Apps
	 */
	var client = {};

	storageBind(client, storage.apps, methods, hooks, options);

	return client;
};
