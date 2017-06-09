'use strict';

var utils = require('../utils');
var _ = utils._;
var md5 = utils.md5;
var randomString = utils.randomString;
var atonic = utils.atonic;
var uuid = utils.uuid;

exports.createUsername = function createUsername(username) {
	username = username || randomString(8);
	username = username.trim().toLowerCase().replace(/[\s-]+/g, '-').replace(/-{2,}/, '-');
	return atonic.lowerCase(username);
};

exports.isValidUsername = function(username) {
	return _.isString(username) && username.trim().length > 2 && username.length <= 32;
};

exports.createUsernameKey = function createUsernameKey(appId, username) {
	return md5([appId.trim(), username.trim()].join('|').toLowerCase()).toLowerCase();
};

exports.newId = function newId() {
	return uuid().toLowerCase();
};
