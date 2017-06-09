'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var UserProfile = require('./user_profile');
var debug = require('debug')('accounts');

module.exports = function createLogin(users, identities) {

	function postSocialLogged(identity) {
		return Promise.all([
			users.update({
				id: identity.userId,
				lastLoginAt: Date.now()
			})
		]).then(function() {
			return identity.userId;
		});
	}

	function socialLogin(profile) {

		var identity = UserProfile.toIdentity(profile);

		debug('Provider logining...', profile);

		return identities.getById(identity.id)
			.then(function(dbIdentity) {
				if (dbIdentity) {
					debug('found identity', dbIdentity.id);
					return postSocialLogged(dbIdentity);
				} else {
					debug('NEW identity', identity.type, identity.id);
					// create a new user
					return users.create(identity.profile)
						.then(function(dbUser) {
							identity.userId = dbUser.id;
							debug('created a new user', dbUser);
							debug('creating a new identity', identity.type, identity.id);

							return identities.create(identity)
								.then(function(dbIdentity2) {
									debug('created a new identity', dbIdentity2);
									return postSocialLogged(dbIdentity2);
								});
						});
				}
			});
	}

	function login(type, data, options) {
		switch (type) {
			case 'social':
				return socialLogin(data, options);
		}

		return Promise.reject(new Error('Login `type` is invalid'));
	}

	return login;
};
