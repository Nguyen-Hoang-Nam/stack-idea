const Fuse = require('fuse.js');

const {fuseConfig} = require('./global');
const {searchResultPrompt} = require('./prompt');
const utils = require('./utils');

/**
 * Check key exist by fuzzy search in stack.
 *
 * @param {Object} stack - Store stack
 * @param {string} key - Search string
 * @return {boolean}
 */
exports.checkFuzzy = (stack, key) => {
	const fuseArray = utils.stackToFuseArray(stack);
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
	const fuseArray = utils.stackToFuseArray(stack);
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	const choices = utils.searchResultToInquirerChoices(searchResult);
	const chooseResult = await searchResultPrompt(choices, key);

	return utils.tickOneOrManyByProperty(stack, chooseResult.result, state);
};

