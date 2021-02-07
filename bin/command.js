
const Table = require('cli-table');
const chalk = require('chalk');

const {tableConfig} = require('./config');
const version = require('./version');
const {checkOneOrManyByProperty, checkOneOrManyByValue, tickOneOrManyByProperty, tickOneOrManyByValue, checkDeepProperty, tickSymbolByState, isManipulate} = require('./utils');
const {checkFuzzy, tickFuzzy} = require('./search');

const table = new Table(tableConfig);

const manipulateStackConfig = ['add-item', 'remove-item', 'get-row', 'add-row', 'remove-row', 'hide-row', 'show-row', 'get-all'];
const manipulateStack = ['tick', 'untick', 'remove', 'show'];

/**
 * Check name exist in stack.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} states - Store items
 * @return {boolean}
 */
const checkOneState = (stack, states) => {
	if (checkOneOrManyByProperty(stack, states)) {
		return true;
	}

	if (checkOneOrManyByValue(stack, states)) {
		return true;
	}

	if (typeof states === 'string' && checkFuzzy(stack, states)) {
		return true;
	}

	return false;
};

/**
 * Tick item.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} states - List of items
 * @param {string} state - Name of state
 * @return {Object}
 */
const tickOneState = async (stack, states, state) => {
	let found = 0;
	if (checkOneOrManyByProperty(stack, states)) {
		found++;
		tickOneOrManyByProperty(stack, states, state);
	}

	if (checkOneOrManyByValue(stack, states)) {
		if (typeof states === 'string' && found === 0) {
			tickOneOrManyByValue(stack, states, state);
		} else if (Array.isArray(states)) {
			tickOneOrManyByValue(stack, states, state);
		}
	}

	if (typeof states === 'string' && found === 0 && checkFuzzy(stack, states)) {
		await	tickFuzzy(stack, states, state);
	}

	return stack;
};

/**
 * Check all items from command exist.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} ticks - Store items need to check
 * @param {string[]} unticks - Store items need to uncheck
 * @param {string[]} removes - Store items need to remove
 * @return {boolean}
 */
exports.checkAllState = (stack, ticks, unticks, removes) => {
	return checkOneState(stack, ticks) || checkOneState(stack, unticks) || checkOneState(stack, removes);
};

/**
 * Tick all items from command.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} ticks - Store items need to check
 * @param {string[]} unticks - Store items need to uncheck
 * @param {string[]} removes - Store items need to remove
 * @return {Object]
 */
exports.tickAllState = async (stack, ticks, unticks, removes) => {
	stack = await tickOneState(stack, ticks, 'tick');
	stack = await tickOneState(stack, unticks, 'untick');
	stack = await tickOneState(stack, removes, 'remove');
	return stack;
};

/**
 * Display stack as table.
 *
 * @param {Object} stack - Store stack
 * @param {boolean} isAll - Show all stack even remove one
 */
exports.showTable = (stack, isAll) => {
	for (let tech in stack) {
		if (checkDeepProperty(stack, tech)) {
			const line = stack[tech];
			let name = line.Name;

			if ((isAll || line.Tick !== 'remove') && name !== 'None') {
				if (line.Tick === 'remove') {
					tech = chalk.gray(tech);
					name = chalk.gray(line.Name);
				} else if (line.Tick === 'tick') {
					tech = chalk.green(tech);
					name = chalk.green(line.Name);
				} else if (line.Tick === 'untick') {
					tech = chalk.white(tech);
					name = chalk.white(line.Name);
				}

				table.push({
					[tech]: [name, tickSymbolByState(line.Tick)]
				});
			}
		}
	}

	console.log(table.toString());
};

/**
 * Check command manipulate config file.
 *
 * @param {Object} args - Argument of command
 * @return {boolean}
 */
exports.isManipulateStackConfig = args =>
	isManipulate(args, manipulateStackConfig);

/**
 * Check command manipulate stack file.
 *
 * @param {Object} args - Argument of command
 * @return {boolean]
 */
exports.isManipulateStack = args =>
	isManipulate(args, manipulateStack);

/**
 * Information of command.
 *
 * @param {string} alias - Alias of command
 * @param {string} mean - Explain command
 * @param {number} pad - Maximum length of command name
 */
const helpCommand = (alias, mean, pad) => console.log(' ', alias.padEnd(pad), mean);

/**
 * Show help.
 *
 * @param {boolean} isHelp - Check command call by help comman
 */
exports.help = isHelp => {
	if (!isHelp) {
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
	helpCommand('--add-item', 'Add item to row in stack-config in global');
	helpCommand('--remove-item', 'Remove item from row in stack-config in global');
	helpCommand('--get-row', 'Print all items of row in stack-config in global');
	helpCommand('--add-row', 'Add row to stack-config in global');
	helpCommand('--remove-row', 'Remove row from stack-config in global');
	helpCommand('--hide-row', 'Hide row in stack-config in global');
	helpCommand('--show-row', 'Show row that hide in stack-config in global');
	helpCommand('--get-all', 'Print stack-config in global');
	console.log('\n');
	console.log('Examples: \n');
	console.log('  $ stack --generate --show');
};

/**
 * Show current version.
 */
exports.version = () => console.log(version);
