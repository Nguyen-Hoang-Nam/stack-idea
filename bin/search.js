const Fuse = require('fuse.js');

const {fuseConfig} = require('./config');
const {searchResultPrompt} = require('./prompt');
const {stackToFuseArray, searchResultToInquirerChoices, tickOneOrManyByProperty} = require('./utils');

exports.checkFuzzy = (result, key) => {
	const fuseArray = stackToFuseArray(result);
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	if (searchResult.length > 0) {
		return true;
	}

	return false;
};

exports.tickFuzzy = async (result, key, state) => {
	const fuseArray = stackToFuseArray(result);
	const fuse = new Fuse(fuseArray, fuseConfig);
	const searchResult = fuse.search(key);

	const choices = searchResultToInquirerChoices(searchResult);
	const chooseResult = await searchResultPrompt(choices, key);

	return tickOneOrManyByProperty(result, chooseResult.result, state);
};

