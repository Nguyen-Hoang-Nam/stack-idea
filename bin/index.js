#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk');
const {generate} = require('./generate');
const {tickAll, help, showTable} = require('./utils');
const {minimistConfig} = require('./config');

const defaultStackConfig = path.join(__dirname, '..', 'stack-config.json');
const stackConfig = './stack-config.json';
const defaultStack = path.join(__dirname, '..', 'stack.json');
const stackPath = './stack.json';

const args = minimist(process.argv.slice(2), minimistConfig);

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
					showTable(result, args.all);
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

				result = tickAll(result, args.tick, args.untick, args.remove);

				showTable(result, args.all);

				const fileResult = JSON.stringify(result, null, 2);

				fs.writeFile(resultPath, fileResult, error => {
					if (error) {
						throw error;
					}

					if (!args.show) {
						console.log(
							chalk.green('Generate successful, check your stack.json or stack --show to show stack')
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

	help();
}
