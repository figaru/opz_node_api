'use strict';

var utils = require('../utils');
// var md5 = utils.md5;
var sha1 = utils.sha1;

function hash(data) {
	return sha1(data.join('|'));
}

exports.createId = function createId(type, key) {
	return hash([type.trim().toLowerCase(), key.trim()]);
};

exports.createKey = function createKey(type, name, value) {
	if (type === 'social') {
		return hash([name.trim(), value.trim()]);
	}
	return hash([value.trim()]);
};
