const Fuse = require('fuse.js');

const {fuseConfig} = require('./config');
const {searchResultPrompt} = require('./prompt');
const {stackToFuseArray, searchResultToInquirerChoices, tickOneOrManyByProperty} = require('./utils');

/**
 * Check key exist by fuzzy search in stack.
 *
 * @param {Object} stack - Store stack
 * @param {string} key - Search string
 * @return {boolean}
 */
exports.checkFuzzy = (stack, key) => {
	const fuseArray = stackToFuseArray(stack);
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	if (searchResult.length > 0) {
		return true;
	}

	return false;
};

/**
 * Tick fuzzy keyword in stack.
 *
 * @param {Object} stack - Store stack
 * @param {string} key - Search string
 * @param {string} state - Name of state
 * @return {Object}
 */
exports.tickFuzzy = async (stack, key, state) => {
	const fuseArray = stackToFuseArray(stack);
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	const choices = searchResultToInquirerChoices(searchResult);
	const chooseResult = await searchResultPrompt(choices, key);

	return tickOneOrManyByProperty(stack, chooseResult.result, state);
};

