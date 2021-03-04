const YAML = require('js-yaml');
const CSV = require('./type/csv');
const TOML = require('@iarna/toml');
const JSON5 = require('json5');
const XML = require('xml-js');
const MD = require('./type/markdown');

/**
 * Write stack to file.
 *
 * @param {Object} stack - Store stack
 * @param {string} type - File type
 * @return {string}
 */
exports.write = (stack, type) => {
	switch (type) {
		case 'yaml':
			return YAML.dump(stack);
		case 'toml':
			return TOML.stringify(stack);
		case 'csv':
			return CSV.write(stack);
		case 'xml':
			return XML.js2xml(stack, {compact: true, spaces: 4});
		case 'md':
			return MD.stackToMarkdownTable(stack);
		default:
			return JSON5.stringify(stack, null, 2);
	}
};

/**
 * Read stack from file.
 *
 * @param {string} buffer - Buffer from file
 * @param {string} type - File type
 * @return {Object}
 */
exports.read = (buffer, type) => {
	switch (type) {
		case 'yaml':
			return YAML.load(buffer);
		case 'toml':
			return TOML.parse(buffer);
		case 'csv':
			return CSV.read(buffer);
		case 'xml':
			return XML.xml2js(buffer, {compact: true, spaces: 4});
		case 'md':
			return MD.markdownTableToStack(buffer);
		default:
			return JSON5.parse(buffer.toString());
	}
};
