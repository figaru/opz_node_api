'use strict';

/**
 * @lends Users
 */
module.exports = {
	/**
	 * Creates a new User
	 * @func
	 * @param  {UserRecord} data  - User object
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise}
	 * @instance
	 */
	create: { args: 1 },
	/**
	 * Update an User fields
	 * @func
	 * @param  {UserRecord} data  - User object
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise}
	 * @instance
	 */
	update: { args: 1 },
	/**
	 * Get an User by id
	 * @func
	 * @param  {String} id  - User id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise}
	 * @instance
	 */
	getById: { args: 1 },
	/**
	 * Delete an User by id
	 * @func
	 * @param  {String} id  - User id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise}
	 * @instance
	 */
	deleteById: { args: 1 }
};
