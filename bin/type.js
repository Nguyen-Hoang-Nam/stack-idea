const YAML = require('js-yaml');
const CSV = require('./type/csv');
const TOML = require('@iarna/toml');
const JSON5 = require('json5');
const XML = require('xml-js');

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

	if (type === 'toml') {
		return TOML.stringify(stack);
	}

	if (type === 'csv') {
		return CSV.write(stack);
	}

	if (type === 'xml') {
		return XML.js2xml(stack, {compact: true, spaces: 4});
	}

	return JSON5.stringify(stack, null, 2);
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

	if (type === 'toml') {
		return TOML.parse(buffer);
	}

	if (type === 'csv') {
		return CSV.read(buffer);
	}

	if (type === 'xml') {
		return XML.xml2js(buffer, {compact: true, spaces: 4});
	}

	return JSON5.parse(buffer.toString());
};

