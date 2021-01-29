const Table = require('cli-table');
const chalk = require('chalk');
const {tableConfig} = require('./config');

const table = new Table(tableConfig);

const symbols = {
	tick: {
		linux: '✔',
		window: '√'
	},
	checkbox: {
		linux: '☐',
		window: '[ ]'
	},
	cross: {
		linux: '✖',
		window: '×'
	}
};

exports.random = tech => {
	const length = tech.length;
	const position = Math.floor(Math.random() * length);
	return tech[position];
};

const symbol = name => {
	return process.platform === 'win32' ? symbols[name].window : symbols[name].linux;
};

const tick = check => {
	if (check === 'untick') {
		return symbol('checkbox');
	}

	if (check === 'tick') {
		return symbol('tick');
	}

	if (check === 'remove') {
		return symbol('cross');
	}
};

const tickOneOrMany = (mark, result, value) => {
	if (typeof mark === 'string') {
		if (Object.prototype.hasOwnProperty.call(result, mark)) {
			result[mark].Tick = value;
		}
	} else if (typeof mark === 'object') {
		mark.forEach(tech => {
			if (Object.prototype.hasOwnProperty.call(result, tech)) {
				result[tech].Tick = value;
			}
		});
	}

	return result;
};

exports.tickAll = (result, ticks, unticks, removes) => {
	result = tickOneOrMany(ticks, result, 'tick');
	result = tickOneOrMany(unticks, result, 'untick');
	result = tickOneOrMany(removes, result, 'remove');
	return result;
};

exports.showTable = (result, all) => {
	for (let tech in result) {
		if (Object.prototype.hasOwnProperty.call(result, tech)) {
			const line = result[tech];
			let name = line.name;

			if (all || line.Tick !== 'remove') {
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

const helpCommand = (alias, mean, pad) => console.log(' ', alias.padEnd(pad), mean);

exports.help = () => {
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
	console.log('\n');
	console.log('Examples: \n');
	console.log('  $ stack --generate --show');
};

exports.tick = tick;
exports.tickOneOrMany = tickOneOrMany;

