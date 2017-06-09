'use strict';

var Joi = require('joi');
var helpers = require('./helpers');

/**
 * User class
 * @class User
 */
exports.create = {
	/**
	 * User id.
	 * @memberof User#
	 * @type {String}
	 */
	id: Joi.string().regex(/^[a-z0-9][a-z0-9-]+[a-z0-9]$/).min(32).max(40).default(helpers.newId, 'new user id'),
	/**
	 * User email.
	 * @memberof User#
	 * @type {String}
	 */
	email: Joi.string().trim().lowercase().email(),
	/**
	 * User username.
	 * @memberof User#
	 * @type {String}
	 */
	username: Joi.string().trim().min(3).max(50),
	/**
	 * User display name.
	 * @memberof User#
	 * @type {String}
	 */
	displayName: Joi.string().trim().min(3).max(100).required(),
	/**
	 * User family name.
	 * @memberof User#
	 * @type {String}
	 */
	familyName: Joi.string().trim().max(50),
	/**
	 * User given name.
	 * @memberof User#
	 * @type {String}
	 */
	givenName: Joi.string().trim().max(50),
	/**
	 * User middle name.
	 * @memberof User#
	 * @type {String}
	 */
	middleName: Joi.string().trim().max(50),
	/**
	 * User gender: `male` or `female`.
	 * @memberof User#
	 * @type {String}
	 */
	gender: Joi.valid('male', 'female'),
	/**
	 * User status. Default: `active`.
	 * @memberof User#
	 * @type {String}
	 */
	status: Joi.string().trim().max(50).default('active'),
	/**
	 * User role. Default: `user`.
	 * @memberof User#
	 * @type {String}
	 */
	roles: Joi.array().items(Joi.string().lowercase().min(1).max(30)),
	/**
	 * Created date. Unix time in milliseconds.
	 * @memberof User#
	 * @type {Number}
	 */
	createdAt: Joi.number().integer().min(1).default(Date.now, 'time of creation'),
	/**
	 * Updated date. Unix time in milliseconds.
	 * @memberof User#
	 * @type {Number}
	 */
	updatedAt: Joi.number().integer().min(1),
	/**
	 * Last login date. Unix time in milliseconds.
	 * @memberof User#
	 * @type {Number}
	 */
	lastLoginAt: Joi.number().integer().min(1),
	/**
	 * User custom data. Max 1000 chars.
	 * @memberof User#
	 * @type {String}
	 */
	metadata: Joi.string().trim().max(1000)
};

exports.update = {
	id: Joi.string().regex(/^[a-z0-9][a-z0-9-]+[a-z0-9]$/).min(32).max(40).required(),
	email: Joi.string().trim().lowercase().email().not(null),
	username: Joi.string().trim().min(3).max(50).not(null),
	displayName: Joi.string().trim().min(3).max(100).not(null),
	familyName: Joi.string().trim().max(50),
	givenName: Joi.string().trim().max(50),
	middleName: Joi.string().trim().max(50),
	gender: Joi.valid('male', 'female'),
	status: Joi.string().trim().max(50).not(null),
	roles: Joi.array().items(Joi.string().lowercase().min(1).max(30)),
	photo: Joi.string().trim().max(255),
	updatedAt: Joi.number().integer().min(0).default(Date.now, 'time of updating'),
	lastLoginAt: Joi.number().integer().min(0).not(null),
	metadata: Joi.string().trim().max(1000)
};
