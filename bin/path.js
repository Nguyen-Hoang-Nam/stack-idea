const path = require('path');
const fs = require('fs');
const Yaml = require('js-yaml');

const {noStackConfig} = require('./message');
const {showTable} = require('./command');

const globalPath = path.join(__dirname, '..');
const localPath = '.';

const getPath = (file, global, yaml) => {
	const stackConfigDirectory = global ? globalPath : localPath;
	const stackConfigPath = `${stackConfigDirectory}/${file}.${yaml ? 'yml' : 'json'}`;

	try {
		fs.accessSync(stackConfigPath);
		return stackConfigPath;
	} catch {
		// Use global stack-config file when local doesn't one
		if (stackConfigDirectory === localPath) {
			return `${globalPath}/${file}.${yaml ? 'yml' : 'json'}`;
		}

		return '';
	}
};

const convertData = (data, yaml) => yaml ? Yaml.dump(data) : JSON.stringify(data, null, 2);

const getData = (buffer, yaml) => yaml ? Yaml.load(buffer) : JSON.parse(buffer.toString());

exports.readFile = (file, args, callback) => {
	const stackConfigPath = getPath(file, args.global, args.yaml);

	if (stackConfigPath) {
		const buffer = fs.readFileSync(stackConfigPath, 'utf8');

		const data = getData(buffer, args.yaml);

		callback(data);
	} else {
		noStackConfig('stack-config');
	}
};

exports.writeFile = (file, object, args) => {
	if (args.show) {
		showTable(object, args.all);
	}

	const path = getPath(file, args.global, args.yaml);

	const data = convertData(object, args.yaml);

	fs.writeFileSync(path, data, 'utf8');
};
