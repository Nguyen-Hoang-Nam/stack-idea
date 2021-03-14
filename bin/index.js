#!/usr/bin/env node

const minimist = require('minimist');

const {generate} = require('./generate');
const command = require('./command');
const editStack = require('./stack/edit');
const global = require('./global');
const file = require('./file');
const editConfig = require('./stackConfig/edit');
const message = require('./message');
const utils = require('./utils');
const progress = require('./progress');

const args = minimist(process.argv.slice(2), global.minimistConfig);

if (args.generate) {
	file.readFile(global.CONFIG, args, config => {
		if (args.temp) {
			config = editConfig.editCommand(config, args);
		}

		const stack = generate(config, {}, config.Hidden);
		const fileName = typeof args.generate === 'string' ? args.generate : global.STORE;

		if (args.no) {
			const table = editStack.showTable(stack, args);
			console.log(table.toString());
		} else {
			file.writeFile(fileName, stack, args);
		}

		if (!args.show) {
			message.successGenerate();
		}
	});
} else if (command.isManipulateStack(args)) {
	const fileName = typeof args.show === 'string' ? args.show : global.STORE;

	file.readFile(fileName, args, stack => {
		let isShow = true;

		if (utils.checkEmpty(args.tick) || utils.checkEmpty(args.untick) || utils.checkEmpty(args.remove)) {
			editStack.tickAllState(stack, args.tick, args.untick, args.remove)
				.then(result => {
					if (!utils.checkObjectEmpty(result)) {
						file.writeFile(global.STORE, result, args);
					}
				});
		} else if (args['get-state']) {
			editStack.getState(stack, args['get-state'])
				.then(table => {
					console.log(table.toString());
				});
		} else if (args['untick-all']) {
			editStack.untickAll(stack);
			file.writeFile(global.STORE, stack, args);
		} else if (args['unremove-all']) {
			editStack.unremoveAll(stack);
			file.writeFile(global.STORE, stack, args);
		} else if (args.progress) {
			const progressBar = progress.progressTick(stack, args);
			console.log(progressBar);
		} else {
			isShow = false;
		}

		if (args.show && !isShow) {
			const table = editStack.showTable(stack, args);
			console.log(table.toString());
		}
	});
} else if (command.isManipulateStackConfig(args)) {
	file.readFile(global.CONFIG, args, config => {
		config = editConfig.editCommand(config, args);

		file.writeFile(global.CONFIG, config, args);
	});
} else if (args.version) {
	const version = command.version();
	console.log(version);
} else {
	const help = command.help(args);
	console.log(help);
}
