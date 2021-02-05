
const Table = require('cli-table');
const chalk = require('chalk');

const {tableConfig} = require('./config');
const version = require('./version');
const {checkOneOrManyByProperty, checkOneOrManyByValue, tickOneOrManyByProperty, tickOneOrManyByValue, checkDeepProperty, tick, isManipulate} = require('./utils');
const {checkFuzzy, tickFuzzy} = require('./search');

const table = new Table(tableConfig);

const manipulateStackConfig = ['add-item', 'remove-item', 'get-row', 'add-row', 'remove-row', 'hide-row', 'show-row', 'get-all'];
const manipulateStack = ['tick', 'untick', 'remove', 'show'];

const checkOneState = (result, states) => {
	if (checkOneOrManyByProperty(result, states)) {
		return true;
	}

	if (checkOneOrManyByValue(result, states)) {
		return true;
	}

	if (typeof states === 'string' && checkFuzzy(result, states)) {
		return true;
	}

	return false;
};

const tickOneState = async (result, states, state) => {
	let found = 0;
	if (checkOneOrManyByProperty(result, states)) {
		found++;
		tickOneOrManyByProperty(result, states, state);
	}

	if (checkOneOrManyByValue(result, states)) {
		if (typeof states === 'string' && found === 0) {
			tickOneOrManyByValue(result, states, state);
		} else if (Array.isArray(states)) {
			tickOneOrManyByValue(result, states, state);
		}
	}

	if (typeof states === 'string' && found === 0 && checkFuzzy(result, states)) {
		await	tickFuzzy(result, states, state);
	}

	return result;
};

exports.checkAllState = (result, ticks, unticks, removes) => {
	return checkOneState(result, ticks) || checkOneState(result, unticks) || checkOneState(result, removes);
};

exports.tickAllState = async (result, ticks, unticks, removes) => {
	result = await tickOneState(result, ticks, 'tick');
	result = await tickOneState(result, unticks, 'untick');
	result = await tickOneState(result, removes, 'remove');
	return result;
};

exports.showTable = (result, all) => {
	for (let tech in result) {
		if (checkDeepProperty(result, tech)) {
			const line = result[tech];
			let name = line.Name;

			if ((all || line.Tick !== 'remove') && name !== 'None') {
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
					[tech]: [name, tick(line.Tick)]
				});
			}
		}
	}

	console.log(table.toString());
};

exports.isManipulateStackConfig = args =>
	isManipulate(args, manipulateStackConfig);

exports.isManipulateStack = args =>
	isManipulate(args, manipulateStack);

const helpCommand = (alias, mean, pad) => console.log(' ', alias.padEnd(pad), mean);

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

exports.version = () => console.log(version);
