'use strict';

var Joi = require('joi');

var IDENTITY_TYPES = ['social', 'email', 'username', 'phone'];

var profileSchema = Joi.object().keys({
	/**
	 * User email.
	 * @memberof Identity#
	 * @type {String}
	 */
	email: Joi.string().trim().lowercase().email(),
	/**
	 * User username.
	 * @memberof Identity#
	 * @type {String}
	 */
	username: Joi.string().trim().min(3).max(50),
	/**
	 * User display name.
	 * @memberof Identity#
	 * @type {String}
	 */
	displayName: Joi.string().trim().min(3).max(100),
	/**
	 * User family name.
	 * @memberof Identity#
	 * @type {String}
	 */
	familyName: Joi.string().trim().max(50),
	/**
	 * User given name.
	 * @memberof Identity#
	 * @type {String}
	 */
	givenName: Joi.string().trim().max(50),
	/**
	 * User middle name.
	 * @memberof Identity#
	 * @type {String}
	 */
	middleName: Joi.string().trim().max(50),
	/**
	 * User gender: `male` or `female`.
	 * @memberof Identity#
	 * @type {String}
	 */
	gender: Joi.valid('male', 'female'),
	/**
	 * User photo.
	 * @memberof Identity#
	 * @type {String}
	 */
	photo: Joi.string().trim().max(255),
	/**
	 * User profile url.
	 * @memberof Identity#
	 * @type {String}
	 */
	url: Joi.string().trim().max(255)
});

/**
 * Identity class
 * @class Identity
 */
exports.create = {
	/**
	 * Identity id.
	 * A hex string. Min 32, max 40 chars. hash(TYPE#KEY)
	 * @memberof Identity#
	 * @type {String}
	 */
	id: Joi.string().hex().min(32).max(40).required(),

	/**
	 * User id.
	 * @memberof Identity#
	 * @type {String}
	 */
	userId: Joi.string().regex(/^[a-z0-9][a-z0-9-]+[a-z0-9]$/).min(32).max(40).required(),

	/**
	 * Identity type: social, email, username, phone number
	 * @type {String}
	 */
	type: Joi.valid(IDENTITY_TYPES).required(),

	/**
	 * Identity name: social provider name(facebook, google, etc.), email, username, phone number
	 * @type {String}
	 */
	name: Joi.string().min(2).max(255).lowercase().required(),

	/**
	 * Identity value: social provider id, password hash
	 * @type {String}
	 */
	value: Joi.string().min(2).max(255).required(),

	/**
	 * Identity key: hash(facebook:profileId, username, email or phone number)
	 * @type {[type]}
	 */
	key: Joi.string().min(32).max(40).lowercase().required(),

	profile: profileSchema,

	/**
	 * Created date. Unix time in milliseconds.
	 * @memberof Identity#
	 * @type {Number}
	 */
	createdAt: Joi.number().integer().min(1).default(Date.now, 'time of creation'),

	/**
	 * Updated date. Unix time in milliseconds.
	 * @memberof Identity#
	 * @type {Number}
	 */
	updatedAt: Joi.number().integer().min(1),

	/**
	 * Identity custom data. Max 1000 chars.
	 * @memberof Identity#
	 * @type {String}
	 */
	metadata: Joi.string().trim().max(1000)
};

exports.update = {
	id: Joi.string().hex().min(32).max(40).required(),
	profile: profileSchema,
	updatedAt: Joi.number().integer().min(0).default(Date.now, 'time of updating').not(null),
	metadata: Joi.string().trim().max(1000)
};
