#!/usr/bin/env node

const fs = require('fs');
const minimist = require('minimist');
const {generate} = require('./generate');
const {tick, tickOneOrMany, helpCommand} = require('./utils');
const path = require('path');
const Table = require('cli-table');
const chalk = require('chalk');

const defaultStackConfig = path.join(__dirname, '..', 'stack-config.json');
const stackConfig = './stack-config.json';
const defaultStack = path.join(__dirname, '..', 'stack.json');
const stackPath = './stack.json';

const args = minimist(process.argv.slice(2), {
	alias: {
		h: 'help',
		v: 'version',
		g: 'generate',
		s: 'show',
		a: 'all',
		t: 'tick',
		u: 'untick',
		r: 'remove',
		G: 'global'
	}
});

const table = new Table({
	head: [chalk.blue('Stack'), chalk.blue('Tech'), chalk.blue('Tick')],
	colAligns: ['left', 'left', 'center'],
	style: {compact: true, 'padding-left': 1, head: [], border: []}
});

if (args.generate) {
	let stackConfigPath = stackConfig;

	fs.access(stackConfigPath, fs.F_OK, error => {
		if (error) {
			stackConfigPath = defaultStackConfig;
		}

		fs.readFile(stackConfigPath, (error, buffer) => {
			if (error) {
				console.log(error);
			} else {
				const techs = JSON.parse(buffer.toString());
				const result = generate(techs, {});

				if (args.show) {
					for (const tech in result) {
						if (Object.prototype.hasOwnProperty.call(result, tech)) {
							table.push({
								[tech]: [result[tech].Name, tick(result[tech].Tick)]
							});
						}
					}

					console.log(table.toString());
				}

				const fileResult = JSON.stringify(result, null, 2);

				const resultPath = args.global ? defaultStack : stackPath;

				fs.writeFile(resultPath, fileResult, error => {
					if (error) {
						throw error;
					}
				});
			}
		});
	});
} else if (args.tick || args.untick || args.remove || args.show) {
	const ticks = args.tick;
	const unticks = args.untick;
	const removes = args.remove;
	const resultPath = args.global ? defaultStack : stackPath;

	fs.access(resultPath, error => {
		if (error) {
			console.log('It\'s weird, are you sure you run \'stack --generate\' first');
		} else {
			fs.readFile(resultPath, (error, buffer) => {
				if (error) {
					throw error;
				}

				let result = JSON.parse(buffer.toString());

				result = tickOneOrMany(ticks, result, 'tick');
				result = tickOneOrMany(unticks, result, 'untick');
				result = tickOneOrMany(removes, result, 'remove');

				for (let tech in result) {
					if (Object.prototype.hasOwnProperty.call(result, tech)) {
						const line = result[tech];
						let name = line.name;

						if (args.all || line.Tick !== 'remove') {
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

				const fileResult = JSON.stringify(result, null, 2);

				fs.writeFile(resultPath, fileResult, error => {
					if (error) {
						throw error;
					}

					if (!args.show) {
						console.log(
							'Generate successful, check your stack.json or stack --show to show stack'
						);
					}
				});
			});
		}
	});
} else if (args.version) {
	console.log('1.1.0');
} else {
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
	console.log('\n');
	console.log('Examples: \n');
	console.log('  $ stack --generate --show');
}
