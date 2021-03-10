const Fuse = require('fuse.js');

const {fuseConfig} = require('./global');

/**
 * Get fuzzy search result
 *
 * @param {Object} stack Store all row
 * @param {string} key Name of row
 * @return {Object[]}
 */
exports.getFuzzy = (fuseArray, key) => {
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	return searchResult;
};
