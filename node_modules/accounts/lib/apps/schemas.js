'use strict';

var Joi = require('joi');
var helpers = require('./helpers');

/**
 * App object
 * @class App
 */
exports.create = {
	/**
	 * Application id.
	 * A hex string. Min 16, max 32 chars.
	 * @memberof App#
	 * @type {String}
	 */
	id: Joi.string().alphanum().lowercase().min(16).max(32).default(helpers.newId, 'new id'),
	/**
	 * Application name. Min 3, max 64 chars.
	 * @memberof App#
	 * @type {String}
	 */
	name: Joi.string().trim().min(3).max(64).required(),
	/**
	 * Created date. Unix time in milliseconds.
	 * @memberof App#
	 * @type {Number}
	 */
	createdAt: Joi.number().integer().min(0).default(Date.now, 'time of creation'),
	/**
	 * Updated date. Unix time in milliseconds.
	 * @memberof App#
	 * @type {Number}
	 */
	updatedAt: Joi.number().integer().min(0),
	/**
	 * Application custom data. Max 1000 chars.
	 * @memberof App#
	 * @type {String}
	 */
	metadata: Joi.string().trim().max(1000)
};

exports.update = {
	id: Joi.string().alphanum().lowercase().min(16).max(32).required(),
	name: Joi.string().trim().min(3).max(64).not(null),
	updatedAt: Joi.number().integer().min(0).default(Date.now, 'time of updating').not(null),
	metadata: Joi.string().trim().max(1000)
};
