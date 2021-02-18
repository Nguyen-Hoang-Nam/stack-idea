#!/usr/bin/env node

const minimist = require('minimist');

const {generate} = require('./generate');
const command = require('./command');
const editStack = require('./stack/edit');
const global = require('./global');
const file = require('./file');
const editConfig = require('./stackConfig/edit');
const message = require('./message');

const args = minimist(process.argv.slice(2), global.minimistConfig);

if (args.generate) {
	file.readFile(global.CONFIG, args, config => {
		if (args.temp) {
			config = editConfig.editCommand(config, args);
		}

		const stack = generate(config, {}, config.Hidden);
		const fileName = typeof args.generate === 'string' ? args.generate : global.STORE;

		file.writeFile(fileName, stack, args);

		if (!args.show) {
			message.successGenerate();
		}
	});
} else if (command.isManipulateStack(args)) {
	const fileName = typeof args.show === 'string' ? args.show : global.STORE;

	file.readFile(fileName, args, result => {
		if (editStack.checkAllState(result, args.tick, args.untick, args.remove)) {
			editStack.tickAllState(result, args.tick, args.untick, args.remove)
				.then(() => {
					file.writeFile(global.STORE, result, args);
				});
		} else if (args.show) {
			const table = editStack.showTable(result, args.all);
			console.log(table.toString());
		} else if (args['get-state']) {
			editStack.getState(result, args['get-state']);
		}
	});
} else if (command.isManipulateStackConfig(args)) {
	file.readFile(global.CONFIG, args, config => {
		config = editConfig.editCommand(config, args);

		file.writeFile(global.CONFIG, config, args);
	});
} else if (args.version) {
	command.version();
} else {
	command.help(args);
}
