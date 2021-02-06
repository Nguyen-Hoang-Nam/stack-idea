const {convertArrayToCSV} = require('convert-array-to-csv');
const {convertCSVToArray} = require('convert-csv-to-array');

const {checkProperty} = require('../utils');

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

exports.write = (stack, separator = ',') => {
	const data = stackToArrayObject(stack, {
		separator
	});
	const csv = convertArrayToCSV(data);

	return csv;
};

exports.read = (buffer, separator = ',') => {
	const csv = buffer.toString();

	const data = convertCSVToArray(csv, {
		header: false,
		separator
	});
	const stack = arrayObjectToStack(data);

	return stack;
};
