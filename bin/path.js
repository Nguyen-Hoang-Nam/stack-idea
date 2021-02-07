const path = require('path');
const fs = require('fs');

const {noStackConfig} = require('./message');
const {showTable} = require('./command');
const {extension} = require('./config');
const {read, write} = require('./type');
const {addRow} = require('./pointer');

const GLOBALPATH = path.join(__dirname, '..');
const LOCALPATH = '.';

/**
 * Generate extension base on type.
 *
 * @param {string} file - Name of file
 * @param {string} type - Name of file type
 * @param {boolean} global - Check global file
 * @return {string}
 */
const getExtension = (file, type, global) => {
	let ext = '';

	if (type) {
		ext = extension[type];
	}

	if (global || !type) {
		ext = 'json';
	}

	return ext;
};

/**
 * Generate path of file.
 *
 * @param {string} file - Name of file
 * @param {string} type - Name of file type
 * @param {boolean} global - Check global file
 * @return {string}
 */
const getPath = (file, type, global) => {
	const stackConfigDirectory = global ? GLOBALPATH : LOCALPATH;
	const stackConfigPath = `${stackConfigDirectory}/${file}.${type}`;

	return stackConfigPath;
};

/**
 * Read file with options.
 *
 * @param {string} file - Name of file
 * @param {Object} args - Argument of command
 * @param {function} callback
 */
exports.readFile = (file, args, callback) => {
	let type = getExtension(file, args.input, args.global);

	let stackConfigPath = getPath(file, type, args.global);

	try {
		fs.accessSync(stackConfigPath);

		const buffer = fs.readFileSync(stackConfigPath, 'utf8');
		const data = read(buffer, type);

		callback(data);
	} catch {
		// Use global stack-config file when local doesn't one
		if (args.global) {
			noStackConfig('stack-config');
		} else {
			type = 'json';
			stackConfigPath = getPath(file, type, true);
			const buffer = fs.readFileSync(stackConfigPath, 'utf8');
			const data = read(buffer, type);

			callback(data);
		}
	}
};

/**
 * Write file with options.
 *
 * @param {string} file - Name of file
 * @param {Object} object - Store stack
 * @param {Object} args - Arguments of command
 */
exports.writeFile = (file, object, args) => {
	if (args.show) {
		showTable(object, args.all);
	}

	const type = getExtension(file, args.output, args.global);

	const path = getPath(file, type, args.global);
	const data = write(object, type);

	addRow(file, path);

	fs.writeFileSync(path, data, 'utf8');
};
