'use strict';

var utils = require('./utils');
var _ = utils._;
var identityHelpers = require('./identities/helpers');

exports.toProfile = function convertToProfile(profile) {
	var data = _.pick(profile, ['displayName', 'username', 'gender']);

	if (profile.name) {
		data.familyName = profile.name.familyName;
		data.givenName = profile.name.givenName;
		data.middleName = profile.name.middleName;
	}

	if (profile.emails && profile.emails.length > 0) {
		data.email = profile.emails[0].value;
	}
	if (profile.photos && profile.photos.length > 0) {
		data.photo = profile.photos[0].value;
	}

	if (profile.profileUrl) {
		data.url = profile.profileUrl;
	}

	data.displayName = data.displayName || data.username || data.givenName;

	return data;
};

exports.toIdentity = function convertToIdentity(profile) {
	var data = {};

	data.profile = exports.toProfile(profile);

	data.type = 'social';
	data.name = profile.provider;
	data.value = profile.id;
	data.key = identityHelpers.createKey(data.type, data.name, data.value);
	data.id = identityHelpers.createId(data.type, data.key);

	return data;
};
