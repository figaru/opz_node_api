'use strict';

var utils = require('../utils');
var md5 = utils.md5;

exports.createId = function createId(appId, provider, profileId) {
	return md5([appId.trim(), provider.trim().toLowerCase(), profileId.trim()].join('|'));
};
