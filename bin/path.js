const path = require('path');
const fs = require('fs');

const {noStackConfig} = require('./message');
const {showTable} = require('./command');
const {extension} = require('./config');
const {read, write} = require('./type');

const GLOBALPATH = path.join(__dirname, '..');
const LOCALPATH = '.';

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

const getPath = (file, type, global) => {
	const stackConfigDirectory = global ? GLOBALPATH : LOCALPATH;
	const stackConfigPath = `${stackConfigDirectory}/${file}.${type}`;
	
	return stackConfigPath;
};

exports.readFile = (file, args, callback) => {
	let type = getExtension(file, args.input, args.global);

	stackConfigPath = getPath(file, type, args.global);

	try {
		fs.accessSync(stackConfigPath);

		const buffer = fs.readFileSync(stackConfigPath, 'utf8');
		const data = read(buffer, type);

		callback(data);
	} catch {
		// Use global stack-config file when local doesn't one
		if (!args.global) {
			type = 'json';
			stackConfigPath = getPath(file, type, true);
			const buffer = fs.readFileSync(stackConfigPath, 'utf8');
			const data = read(buffer, type);

			callback(data);
		} else {
			noStackConfig('stack-config');
		}
	}
};

exports.writeFile = (file, object, args) => {
	if (args.show) {
		showTable(object, args.all);
	}

	let type = getExtension(file, args.output, args.global);

	const path = getPath(file, type, args.global);
	const data = write(object, type);

	fs.writeFileSync(path, data, 'utf8');
};
