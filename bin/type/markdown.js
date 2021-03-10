const utils = require('../utils');

/**
 * Convert stack object to markdown table.
 *
 * @param {Object} stack Store all row
 * @return {string}
 */
exports.stackToMarkdownTable = stack => {
	let markdownTable = '| Stack | Tech | Tick |\n| :--- | :--- | :----: |\n';

	for (const row in stack) {
		if (utils.checkProperty(stack, row)) {
			markdownTable += `| ${row} | ${stack[row].Name} | ${stack[row].Tick} |\n`;
		}
	}

	return markdownTable;
};

/**
 * Convert markdown table to stack object.
 *
 * @param {string} markdownTable Store table from markdown
 * @return {Object}
 */
exports.markdownTableToStack = markdownTable => {
	const rows = markdownTable.split('\n');
	rows.splice(0, 2);

	const stack = {};
	for (const row of rows) {
		const cols = row.split('|');
		stack[cols[0].trim()] = {Name: cols[1].trim(), Tick: cols[2].trim()};
	}

	return stack;
};
