'use strict';

var utils = require('../utils');
var randomString = utils.randomString;

exports.newId = function newId() {
	return randomString({
		length: 16,
		charset: 'alphanumeric'
	}).toLowerCase();
};
