'use strict';

var createUsers = require('./users');
var createIdentities = require('./identities');
var createLogin = require('./login');
var Options = require('./options');

/**
 * Creates a new Api object.
 * @constructs Api
 * @param  {Storage} storage A Storage instance.
 * @param  {ApiOptions} [options] Api options.
 * @return {Api}         An instance of Api.
 */
module.exports = function createApi(storage, appId, options) {

	options = Options.app(options);

	var users = createUsers(storage, appId, options);
	var identities = createIdentities(storage, appId, options);
	// var fields = createFields(storage, appId, options);

	/**
	 * Api object
	 * @lends Api#
	 */
	var client = {
		// fields: fields,
		/**
		 * An Users object
		 * @type {Users}
		 */
		users: users,
		/**
		 * An Identities object
		 * @type {Identities}
		 */
		identities: identities,
		/**
		 * Login an user
		 * @function
		 * @param  {UserProfile} profile - User's Profile
		 * @param  {DataOptions} [options] - Login options
		 * @return {Promise<String>} Returns an user id.
		 */
		login: createLogin(users, identities, storage, appId, options)
	};

	return client;
};
