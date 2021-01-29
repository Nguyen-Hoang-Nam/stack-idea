#!/usr/bin/env node

const fs = require('fs');
const minimist = require('minimist');
const chalk = require('chalk');
const yaml = require('js-yaml');

const {generate} = require('./generate');
const {tickAll, checkAllTick, help, showTable} = require('./utils');
const {minimistConfig} = require('./config');
const {defaultStack, defaultStackConfig, stackConfig, stackPath, stackConfigYaml, stackPathYaml} = require('./path.js');

const args = minimist(process.argv.slice(2), minimistConfig);

if (args.generate) {
	let stackConfigPath = args.yaml ? stackConfigYaml : stackConfig;

	fs.access(stackConfigPath, fs.F_OK, error => {
		if (error) {
			stackConfigPath = defaultStackConfig;
		}

		const buffer = fs.readFileSync(stackConfigPath, 'utf8');

		const techs = args.yaml && !error ? yaml.load(buffer) : JSON.parse(buffer.toString());

		const result = generate(techs, {});

		if (args.show) {
			showTable(result, args.all);
		}

		const resultPath = args.global ? defaultStack : (args.yaml ? stackPathYaml : stackPath);

		const fileResult = args.yaml ? yaml.dump(result) : JSON.stringify(result, null, 2);

		fs.writeFileSync(resultPath, fileResult, 'utf8');
	});
} else if (args.tick || args.untick || args.remove || args.show) {
	const resultPath = args.global ? defaultStack : (args.yaml ? stackPathYaml : stackPath);

	fs.access(resultPath, error => {
		if (error) {
			console.log('It\'s weird, are you sure you run \'stack --generate\' first');
		} else {
			const buffer = fs.readFileSync(resultPath, 'utf8');

			let result = args.yaml ? yaml.load(buffer) : JSON.parse(buffer.toString());

			if (checkAllTick(result, args.tick, args.untick, args.remove)) {
				result = tickAll(result, args.tick, args.untick, args.remove);
			}

			showTable(result, args.all);

			if (checkAllTick(result, args.tick, args.untick, args.remove)) {
				const fileResult = args.yaml ? yaml.dump(result) : JSON.stringify(result, null, 2);

				fs.writeFileSync(resultPath, fileResult, 'utf8');

				if (!args.show) {
					console.log(
						chalk.green('Generate successful, check your stack.json or stack --show to show stack')
					);
				}
			}
		}
	});
} else if (args.version) {
	console.log('1.2.0');
} else {
	if (!args.help) {
		console.log(chalk.yellow('\nMake sure you use right options list below:'));
	}

	help();
}
