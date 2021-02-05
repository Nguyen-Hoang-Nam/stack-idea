const inquirer = require('inquirer');

const {searchPromptConfig} = require('./config');

exports.searchResultPrompt = async (choices, key) => {
	const message = `Choose the best match with (${key})`;
	const config = searchPromptConfig(message, choices);

	return inquirer.prompt(config);
};

