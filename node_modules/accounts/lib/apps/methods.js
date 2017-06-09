'use strict';

/**
 * @lends Apps#
 */
module.exports = {
	/**
	 * Create a new App
	 * @func
	 * @param {AppRecord} data - App data
	 * @param {DataOptions} [options] - Data options
	 * @return {Promise<App>}
	 */
	create: { args: 1 },
	/**
	 * Get an app by id
	 * @func
	 * @param {String} id - App id
	 * @param {DataOptions} [options] - Data options
	 * @return {Promise<App>}
	 */
	getById: { args: 1 }
};
