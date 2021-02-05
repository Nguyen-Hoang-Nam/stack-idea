#!/usr/bin/env node

const minimist = require('minimist');

const {generate} = require('./generate');
const {tickAllState, checkAllState, help, showTable, version, isManipulateStack, isManipulateStackConfig} = require('./command');
const {minimistConfig} = require('./config');
const {readFile, writeFile} = require('./path.js');
const {addItem, removeItem, getRow, addRow, removeRow, hiddenRow, showRow, getAll} = require('./manipulate');
const {successGenerate} = require('./message');

const args = minimist(process.argv.slice(2), minimistConfig);

const CONFIG = 'stack-config';
const STORE = 'stack';

if (args.generate) {
	readFile(CONFIG, args, techs => {
		const result = generate(techs, {}, techs.Hidden);
		const fileName = typeof args.generate === 'string' ? args.generate : STORE;

		writeFile(fileName, result, args);

		if (!args.show) {
			successGenerate();
		}
	});
} else if (isManipulateStackConfig(args)) {
	readFile(CONFIG, args, techs => {
		if (args['add-item']) {
			addItem(techs, args['add-item'], args.item);
		} else if (args['remove-item']) {
			removeItem(techs, args['remove-item'], args.item);
		} else if (args['get-row']) {
			getRow(techs, args['get-row']);
		} else if (args['add-row']) {
			addRow(techs, args['add-row'], args.item);
		} else if (args['remove-row']) {
			removeRow(techs, args['remove-row']);
		} else if (args['hide-row']) {
			hiddenRow(techs, args['hide-row']);
		} else if (args['show-row']) {
			showRow(techs, args['show-row']);
		} else if (args['get-all']) {
			getAll(techs);
		}

		writeFile(CONFIG, techs, args);
	});
} else if (isManipulateStack(args)) {
	const fileName = typeof args.show === 'string' ? args.show : STORE;

	readFile(fileName, args, result => {
		if (checkAllState(result, args.tick, args.untick, args.remove)) {
			result = tickAllState(result, args.tick, args.untick, args.remove);

			writeFile(STORE, result, args);
		} else if (args.show) {
			showTable(result, args.all);
		}
	});
} else if (args.version) {
	version();
} else {
	help(args.help);
}
