'use strict';

var storageBind = require('../storage_bind');
var hooks = require('./hooks');
var methods = require('./methods');

/**
 * Creates a new Fields object.
 * @constructs Fields
 * @param  {Storage} storage - A Storage instance.
 * @param  {String} appId - An applicatin id
 * @param  {AppOptions} [options] App options.
 * @return {Fields}
 */
module.exports = function createFields(storage, appId, options) {

	/**
	 * Fields object
	 * @lends Fields
	 */
	var client = {};

	storageBind(client, storage.fields, methods, hooks, options, appId);

	return client;
};
