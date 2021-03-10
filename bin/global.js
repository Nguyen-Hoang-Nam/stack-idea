const chalk = require('chalk');

exports.CONFIG = 'stack-config';
exports.STORE = 'stack';

exports.minimistConfig = {
	alias: {
		h: 'help',
		v: 'version',
		g: 'generate',
		s: 'show',
		a: 'all',
		t: 'tick',
		u: 'untick',
		r: 'remove',
		G: 'global',
		y: 'yaml',
		i: 'item',
		n: 'no',
		d: 'decrease',
		p: 'progress'
	}
};

exports.tableConfig = {
	head: [chalk.blue('Stack'), chalk.blue('Tech'), chalk.blue('Tick')],
	colAligns: ['left', 'left', 'center'],
	style: {compact: true, 'padding-left': 1, head: [], border: []}
};

exports.fuseConfig = {
	keys: [
		{
			name: 'Stack',
			weight: 0.6
		},
		{
			name: 'Tech',
			weight: 0.4
		}
	]
};

/**
 * Generate config for search.
 *
 * @param {string} message - Question ask user to choose
 * @param {Object[]} choices - List of options
 * @return {Object}
 */
exports.searchPromptConfig = (message, choices) => ([
	{
		type: 'list',
		name: 'result',
		message,
		choices
	}
]);

exports.extension = {
	json: 'json',
	yaml: 'yml',
	toml: 'toml',
	xml: 'xml',
	csv: 'csv'
};

exports.manipulateStackConfig = [
	'add-item',
	'remove-item',
	'get-row',
	'add-row',
	'remove-row',
	'hide-row',
	'show-row',
	'get-all'
];

exports.manipulateStack = [
	'tick',
	'untick',
	'remove',
	'show',
	'get-state',
	'untick-all',
	'unremove-all',
	'progress'
];

