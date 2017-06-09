'use strict';

/**
 * @lends Connections
 */
module.exports = {
	/**
	 * Creates a new Connection
	 * @function
	 * @param  {ConnectionRecord} data  - User object
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<ConnectionRecord>}
	 * @instance
	 */
	create: { args: 1 },
	/**
	 * Update a Connection fields
	 * @function
	 * @param  {ConnectionRecord} data  - Connection object
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<ConnectionRecord>}
	 * @instance
	 */
	update: { args: 1 },
	/**
	 * Get a Connection by id
	 * @function
	 * @param  {String} id  - Connection id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<ConnectionRecord>}
	 * @instance
	 */
	getById: { args: 1 },
	/**
	 * Find Connections by user id
	 * @function
	 * @param  {String} userId  - User id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<ConnectionRecord[]>}
	 * @instance
	 */
	findByUserId: { args: 1 },
	/**
	 * Delete an Connection by id
	 * @function
	 * @param  {String} id  - Connection id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<Number>}
	 * @instance
	 */
	deleteById: { args: 1 },
	/**
	 * Delete an Connections by user id
	 * @function
	 * @param  {String} userId  - User id
	 * @param  {DataOptions} [options] - Data options
	 * @return {Promise<Number>}
	 * @instance
	 */
	deleteByUserId: { args: 1 }
};
