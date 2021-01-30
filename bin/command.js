
const Table = require('cli-table');
const chalk = require('chalk');

const {tableConfig} = require('./config');
const version = require('./version');
const {checkTick, tickOneOrMany, checkDeepProperty, tick, isManipulate} = require('./utils');

const table = new Table(tableConfig);

const manipulateStackConfig = ['add-item', 'remove-item', 'get-row', 'add-row', 'remove-row', 'hide-row', 'show-row', 'get-all'];
const manipulateStack = ['tick', 'untick', 'remove', 'show'];

exports.checkAllTick = (result, ticks, unticks, removes) => {
	return checkTick(ticks, result) || checkTick(unticks, result) || checkTick(removes, result);
};

exports.tickAll = (result, ticks, unticks, removes) => {
	result = tickOneOrMany(ticks, result, 'tick');
	result = tickOneOrMany(unticks, result, 'untick');
	result = tickOneOrMany(removes, result, 'remove');
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
