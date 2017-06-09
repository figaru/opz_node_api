'use strict';

var storageBind = require('../storage_bind');
var hooks = require('./hooks');
var methods = require('./methods');

/**
 * Creates a new Identities object.
 * @constructs Identities
 * @param  {Storage} storage - A Storage instance.
 * @param  {String} appId - An applicatin id
 * @param  {AppOptions} [options] App options.
 * @return {Identities}
 */
module.exports = function createIdentities(storage, appId, options) {

	/**
	 * Identities object
	 * @lends Identities
	 */
	var client = {};

	storageBind(client, storage.identities, methods, hooks, options, appId);

	return client;
};
