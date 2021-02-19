const chalk = require('chalk');

const global = require('./global');
const version = require('./version');
const utils = require('./utils');

/**
 * Check command manipulate config file.
 *
 * @param {Object} args - Argument of command
 * @return {boolean}
 */
exports.isManipulateStackConfig = args =>
	utils.isManipulate(args, global.manipulateStackConfig);

/**
 * Check command manipulate stack file.
 *
 * @param {Object} args - Argument of command
 * @return {boolean]
 */
exports.isManipulateStack = args =>
	utils.isManipulate(args, global.manipulateStack);

/**
 * Information of command.
 *
 * @param {string} alias - Alias of command
 * @param {string} mean - Explain command
 * @param {number} pad - Maximum length of command name
 */
const helpCommand = (alias, mean, pad = 24) => console.log(' ', alias.padEnd(pad), mean);

/**
 * Show help.
 *
 * @param {Object} args - Store arguments of command
 */
exports.help = args => {
	if (!args.help) {
		console.log(chalk.yellow('\nMake sure you use right options list below:'));
	}

	console.log('\n');
	console.log('Usage: stack <Options>');
	console.log('\n');
	console.log('Options: \n');
	helpCommand('-h, --help', 'Show help');
	helpCommand('-v, --version', 'Show version');
	helpCommand('-g, --generate', 'Generate stack base on stack-config.json and store in stack.json');
	helpCommand('-s, --show', 'Show stack from stack.json');
	helpCommand('-a, --all', 'Show all tech even remove one');
	helpCommand('-t, --tick', 'Tick after setup tech successful');
	helpCommand('-u, --untick', 'Untick when setup are not done yet');
	helpCommand('-r, --remove', 'Remove tech that not use');
	helpCommand('-G, --global', 'Use file stack.json in global');
	helpCommand('-y, --yaml', 'Use yaml file type instead of json');
	helpCommand('-i, --item ', 'Use to input array of parameter');
	helpCommand('-n, --no', 'Not create output file');

	if (args.help && args.all) {
		helpCommand('--untick-all', 'Untick all row');
		helpCommand('--unremove-all', 'Unremove all row');
		helpCommand('--add-item', 'Add item to row in stack-config in global');
		helpCommand('--remove-item', 'Remove item from row in stack-config in global');
		helpCommand('--get-row', 'Print all items of row in stack-config in global');
		helpCommand('--add-row', 'Add row to stack-config in global');
		helpCommand('--remove-row', 'Remove row from stack-config in global');
		helpCommand('--hide-row', 'Hide row in stack-config in global');
		helpCommand('--show-row', 'Show row that hide in stack-config in global');
		helpCommand('--get-all', 'Show stack-config as tree in global');
	}

	console.log('\n');
	console.log('Examples: \n');
	console.log('  $ stack --generate --show');
};

/**
 * Show current version.
 */
exports.version = () => console.log(version);
