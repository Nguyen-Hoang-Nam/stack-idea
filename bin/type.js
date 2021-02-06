const YAML = require('js-yaml');
const CSV = require('./type/csv');

exports.write = (stack, type, option = {}) => {
	if (type === 'yaml') {
		return YAML.dump(stack);
	}

	if (type === 'csv') {
		return CSV.write(stack);
	}

	return JSON.stringify(stack, null, 2);
};

exports.read = (buffer, type, option = {}) => {
	if (type === 'yaml') {
		return YAML.load(buffer);
	}

	if (type === 'csv') {
		return CSV.read(buffer);
	}

	return JSON.parse(buffer.toString());
};

