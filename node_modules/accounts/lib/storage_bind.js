'use strict';

var utils = require('./utils');
var Promise = utils.Promise;

function validateMethodArgs(methods, method, args) {
	var info = methods[method];
	if (info.args > args.length) {
		throw new Error('Method `' + method + '` accepts minimum ' + info.args + ' argument(s)');
	}
}

function bindMethod(storageContainer, methods, method, hooks, options, appId) {

	function preHook(args) {
		var op = hooks.pre[method];
		var promise;

		if (op) {
			try {
				promise = op.apply(null, args);
			} catch (e) {
				return Promise.reject(e);
			}
			return Promise.resolve(promise)
				.then(function(result) {
					// update `data` param
					if (typeof result !== 'undefined') {
						args[appId ? 1 : 0] = result;
					}
				});
		}
		return Promise.resolve();
	}

	function postHook(args, result) {
		var op = hooks.post[method];
		var promise;
		if (op) {
			args.unshift(result);
			try {
				promise = op.apply(null, args);
			} catch (e) {
				return Promise.reject(e);
			}
			return Promise.resolve(promise)
				.then(function(postResult) {
					if (typeof postResult !== 'undefined') {
						return postResult;
					}
					return result;
				});
		}

		return result;
	}

	function methodBind() {
		// validating storage method
		if (!storageContainer[method]) {
			return Promise.reject(new Error('Method `' + method + '` not found on client'));
		}

		var args = Array.prototype.slice.call(arguments);

		try {
			validateMethodArgs(methods, method, args);
		} catch (e) {
			return Promise.reject(e);
		}

		// last hook argument is the `accounts` options
		args.push(options);

		if (appId) {
			// first hook argument is the app id
			args.unshift(appId);
		}

		return preHook(args)
			.then(function() {
				return storageContainer[method].apply(storageContainer, args)
					.then(function(result) {
						return postHook(args, result);
					});
			});
	}

	return methodBind;
}

module.exports = function storageBind(target, storageContainer, methods, hooks, options, appId) {
	Object.keys(methods).forEach(function(method) {
		target[method] = bindMethod(storageContainer, methods, method, hooks, options, appId);
	});
};
