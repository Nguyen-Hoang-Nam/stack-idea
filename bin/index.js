#!/usr/bin/env node

const minimist = require('minimist');

const {generate} = require('./generate');
const command = require('./command');
const config = require('./config');
const file = require('./file');
const editConfig = require('./stackConfig/edit');
const message = require('./message');

const args = minimist(process.argv.slice(2), config.minimistConfig);

if (args.generate) {
	file.readFile(config.CONFIG, args, techs => {
		const result = generate(techs, {}, techs.Hidden);
		const fileName = typeof args.generate === 'string' ? args.generate : config.STORE;

		file.writeFile(fileName, result, args);

		if (!args.show) {
			message.successGenerate();
		}
	});
} else if (command.isManipulateStackConfig(args)) {
	file.readFile(config.CONFIG, args, techs => {
		if (args['add-item']) {
			editConfig.addItem(techs, args['add-item'], args.item);
		} else if (args['remove-item']) {
			editConfig.removeItem(techs, args['remove-item'], args.item);
		} else if (args['get-row']) {
			editConfig.getRow(techs, args['get-row']);
		} else if (args['add-row']) {
			editConfig.addRow(techs, args['add-row'], args.item);
		} else if (args['remove-row']) {
			editConfig.removeRow(techs, args['remove-row']);
		} else if (args['hide-row']) {
			editConfig.hiddenRow(techs, args['hide-row']);
		} else if (args['show-row']) {
			editConfig.showRow(techs, args['show-row']);
		} else if (args['get-all']) {
			editConfig.getAll(techs);
		}

		file.writeFile(config.CONFIG, techs, args);
	});
} else if (command.isManipulateStack(args)) {
	const fileName = typeof args.show === 'string' ? args.show : config.STORE;

	file.readFile(fileName, args, result => {
		if (command.checkAllState(result, args.tick, args.untick, args.remove)) {
			command.tickAllState(result, args.tick, args.untick, args.remove)
				.then(() => {
					file.writeFile(config.STORE, result, args);
				});
		} else if (args.show) {
			const table = command.showTable(result, args.all);
			console.log(table.toString());
		} else if (args['get-state']) {
			command.getState(result, args['get-state']);
		}
	});
} else if (args.version) {
	command.version();
} else {
	command.help(args.help);
}
