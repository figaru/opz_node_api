'use strict';

var Joi = require('joi');

/**
 * Connection class
 * @class Connection
 */
exports.create = {
	userId: Joi.string().guid().required(),
	name: Joi.string().trim().min(2).max(50).lowercase().required(),
	value: Joi.string().trim().max(400).required()
};

exports.update = {
	userId: Joi.string().guid().required(),
	name: Joi.string().trim().min(2).max(50).lowercase().required().not(null),
	value: Joi.string().trim().max(400).required().not(null)
};
