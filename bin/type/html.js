const utils = require('../utils');
/**
 * Write file to csv.
 *
 * @param {Object} stack - Store stack
 * @param {string} separator - Separator in csv
 * @return {string}
 */
exports.write = stack => {
	let html = '<table><tr><th>Stack</th><th>Tech</th><th>Tick</th></tr>';

	for (const row in stack) {
		if (utils.checkProperty(stack, row)) {
			html += `<tr><td>${row}</td><td>${stack[row].Name}</td><td>${utils.tickSymbolByState(stack[row].Tick)}</td></tr>`;
		}
	}

	html += '</table>';
	return html;
};

/**
 * Read csv file.
 *
 * @param {string} buffer - Buffer from csv file
 * @param {string} separator - Separator in csv
 * @return {Object}
 */
exports.read = buffer => {
	buffer = buffer.toString();
	const rowPattern = /<tr>.+?<\/tr>/g;
	const collumnPattern = /(?<=<td>).+?(?=<\/td>)/g;
	const rows = buffer.match(rowPattern);
	rows.shift();

	const stack = {};
	for (const row of rows) {
		const columns = row.match(collumnPattern);
		stack[columns[0]] = {
			Name: columns[1],
			Tick: columns[2]
		};
	}

	return stack;
};
