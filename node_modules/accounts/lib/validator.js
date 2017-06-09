'use strict';

var utils = require('./utils');
var _ = utils._;
var Joi = require('joi');

var config = {};

['apps', 'identities', 'users'].forEach(function(model) {
	var schemas = require('./' + model + '/schemas');
	config[model] = {
		create: schemas.create,
		createKeys: Object.keys(schemas.create),
		update: schemas.update,
		updateKeys: Object.keys(schemas.update)
	};
});

function validate(method, model, data) {
	// console.log(model, method);
	// console.log('validating:', data);

	var schema = config[model][method];
	var schemaKeys = config[model][method + 'Keys'];

	data = _.pick(data, schemaKeys);

	var valid = Joi.validate(data, schema, {
		convert: true,
		noDefaults: false,
		allowUnknown: false
	});
	if (valid.error) {
		throw valid.error;
	}
	// console.log(valid.value);
	return valid.value;
}

exports.create = function(model, data) {
	return validate('create', model, data);
};

exports.update = function(model, data) {
	return validate('update', model, data);
};
