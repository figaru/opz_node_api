'use strict';

var utils = require('./utils');
var _ = utils._;
var randomString = utils.randomString;

var CLIENT_OPTIONS = {
	secret: randomString(16)
};

var APP_OPTIONS = {

};

exports.client = function createClientOptions(options) {
	return _.defaultsDeep({}, options, CLIENT_OPTIONS);
};

exports.app = function createAppOptions(options) {
	return _.defaultsDeep({}, options, APP_OPTIONS);
};
