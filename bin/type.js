const YAML = require('js-yaml');
const CSV = require('./type/csv');

/**
 * Write stack to file.
 *
 * @param {Object} stack - Store stack
 * @param {string} type - File type
 * @return {string}
 */
exports.write = (stack, type) => {
	if (type === 'yaml') {
		return YAML.dump(stack);
	}

	if (type === 'csv') {
		return CSV.write(stack);
	}

	return JSON.stringify(stack, null, 2);
};

/**
 * Read stack from file.
 *
 * @param {string} buffer - Buffer from file
 * @param {string} type - File type
 * @return {Object}
 */
exports.read = (buffer, type) => {
	if (type === 'yaml') {
		return YAML.load(buffer);
	}

	if (type === 'csv') {
		return CSV.read(buffer);
	}

	return JSON.parse(buffer.toString());
};

