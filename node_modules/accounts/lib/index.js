'use strict';

var createApp = require('./app');
var createAdmin = require('./admin');
var createApps = require('./apps');
var Options = require('./options');

/**
 * Creates a new Client object.
 * @constructs Client
 * @param  {Storage} storage A Storage instance.
 * @param  {ClientOptions} options Client options.
 * @return {Client}         An instance of Client.
 */
module.exports = function createClient(storage, options) {

	if (typeof storage !== 'object') {
		throw new Error('`storage` param is invalid');
	}

	options = Options.client(options);

	/**
	 * Client object
	 * @lends Client#
	 */
	var client = {
		/**
		 * An Admin object
		 * @type {Admin}
		 */
		admin: createAdmin(storage, options),
		/**
		 * An Apps object
		 * @type {Apps}
		 */
		apps: createApps(storage, options),
		/**
		 * Creates a new Api object.
		 * @param {string} appId - Application id.
		 * @param {ApiOptions} [apiOptions] - Api options.
		 * @return {Api}
		 */
		app: function(appId, apiOptions) {
			return createApp(storage, appId, apiOptions);
		}
	};

	return client;

};
