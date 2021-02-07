const {convertArrayToCSV} = require('convert-array-to-csv');
const {convertCSVToArray} = require('convert-csv-to-array');

const {checkProperty} = require('../utils');

/**
 * Convert stack to array of object.
 *
 * @param {Object} stack - Store stack
 * @return {Object[]}
 */
const stackToArrayObject = stack => {
	const stackArray = [];

	for (const row in stack) {
		if (checkProperty(stack, row)) {
			const item = {
				Stack: row,
				Tech: stack[row].Name,
				Tick: stack[row].Tick
			};

			stackArray.push(item);
		}
	}

	return stackArray;
};

/**
 * Convert array object to stack.
 *
 * @param {Object[]} data - Array object from csv file
 * @return {Object}
 */
const arrayObjectToStack = data => {
	const stack = {};

	for (const row of data) {
		stack[row.Stack] = {
			Name: row.Tech,
			Tick: row.Tick
		};
	}

	return stack;
};

/**
 * Write file to csv.
 *
 * @param {Object} stack - Store stack
 * @param {string} separator - Separator in csv
 * @return {string}
 */
exports.write = (stack, separator = ',') => {
	const data = stackToArrayObject(stack, {
		separator
	});
	const csv = convertArrayToCSV(data);

	return csv;
};

/**
 * Read csv file.
 *
 * @param {string} buffer - Buffer from csv file
 * @param {string} separator - Separator in csv
 * @return {Object}
 */
exports.read = (buffer, separator = ',') => {
	const csv = buffer.toString();

	const data = convertCSVToArray(csv, {
		header: false,
		separator
	});
	const stack = arrayObjectToStack(data);

	return stack;
};
