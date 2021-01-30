#!/usr/bin/env node

const minimist = require('minimist');

const {generate} = require('./generate');
const {tickAll, checkAllTick, help, showTable, version} = require('./utils');
const {minimistConfig} = require('./config');
const {readFile, writeFile} = require('./path.js');
const {addItem} = require('./manipulate');
const {successGenerate} = require('./message');

const args = minimist(process.argv.slice(2), minimistConfig);

const CONFIG = 'stack-config';
const STORE = 'stack';

if (args.generate) {
	readFile(CONFIG, args, techs => {
		const result = generate(techs, {});

		writeFile(STORE, result, args);

		if (!args.show) {
			successGenerate();
		}
	});
} else if (args['add-item'] || args['get-row'] || args['add-row'] || args['remove-item'] || args['remove-row'] || args['hide-row']) {
	readFile(CONFIG, args, techs => {
		if (args['add-item']) {
			techs = addItem(techs, args['add-item'][0], args['add-item'][1]);
		}

		writeFile(CONFIG, techs, args);
	});
} else if (args.tick || args.untick || args.remove || args.show) {
	readFile(STORE, args, result => {
		if (checkAllTick(result, args.tick, args.untick, args.remove)) {
			result = tickAll(result, args.tick, args.untick, args.remove);

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
