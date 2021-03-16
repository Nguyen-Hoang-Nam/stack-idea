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
const helpCommand = (alias, mean, pad = 24) => ' ' + alias.padEnd(pad) + mean;

exports.helpCommand = helpCommand;

/**
 * Show help.
 *
 * @param {Object} args - Store arguments of command
 */
exports.help = args => {
	let help = '';
	if (!args.help) {
		help += chalk.yellow('\nMake sure you use right options list below:');
	}

	help += '\n';
	help += 'Usage: stack <Options>';
	help += '\n';
	help += 'Options: \n';
	help += helpCommand('-h, --help', 'Show help\n');
	help += helpCommand('-v, --version', 'Show version\n');
	help += helpCommand('-g, --generate', 'Generate stack base on stack-config.json and store in stack.json\n');
	help += helpCommand('-s, --show', 'Show stack from stack.json\n');
	help += helpCommand('-a, --all', 'Show all tech even remove one\n');
	help += helpCommand('-t, --tick', 'Tick after setup tech successful\n');
	help += helpCommand('-u, --untick', 'Untick when setup are not done yet\n');
	help += helpCommand('-r, --remove', 'Remove tech that not use\n');
	help += helpCommand('-G, --global', 'Use file stack.json in global\n');
	help += helpCommand('-y, --yaml', 'Use yaml file type instead of json\n');
	help += helpCommand('-i, --item ', 'Use to input array of parameter\n');
	help += helpCommand('-n, --no', 'Not create output file\n');
	help += helpCommand('--sort', 'Sort row of table\n');
	help += helpCommand('-d, --decrease', 'Sort by decreasing\n');
	help += helpCommand('-p, --progress', 'Show progress of tick row\n');

	if (args.help && args.all) {
		help += helpCommand('--untick-all', 'Untick all row\n');
		help += helpCommand('--unremove-all', 'Unremove all row\n');
		help += helpCommand('--add-item', 'Add item to row in stack-config in global\n');
		help += helpCommand('--remove-item', 'Remove item from row in stack-config in global\n');
		help += helpCommand('--get-row', 'Print all items of row in stack-config in global\n');
		help += helpCommand('--add-row', 'Add row to stack-config in global\n');
		help += helpCommand('--remove-row', 'Remove row from stack-config in global\n');
		help += helpCommand('--hide-row', 'Hide row in stack-config in global\n');
		help += helpCommand('--show-row', 'Show row that hide in stack-config in global\n');
		help += helpCommand('--get-all', 'Show stack-config as tree in global\n');
	}

	help += '\n';
	help += 'Examples: \n';
	help += '  $ stack --generate --show';
	return help;
};

/**
 * Show current version.
 */
exports.version = () => version.version;
