const Table = require('cli-table3');
const chalk = require('chalk');

const global = require('../global');
const utils = require('../utils');
const search = require('../search');
const prompt = require('../prompt');

const table = new Table(global.tableConfig);

/**
 * Tick item.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} states - List of items
 * @param {string} state - Name of state
 * @return {Object}
 */
const tickOneState = async (stack, states, state) => {
	let result = [];
	const stateType = utils.checkEmpty(states);

	if (stateType) {
		states = stateType === 1 ? [states] : [...new Set(states)];

		for (const row of states) {
			let found = false;
			if (result.includes(row)) {
				found = true;
			}

			if (!found && utils.checkProperty(stack, row)) {
				result.push(row);
				found = true;
			}

			if (!found) {
				const results = utils.getAllByValue(stack, row);

				if (results.length > 0) {
					result.push(...results);
					found = true;
				}
			}

			if (!found) {
				const fuseArray = utils.stackToFuseArray(stack);
				const searchResult = search.getFuzzy(fuseArray, row);

				if (searchResult.length > 0) {
					let choices = utils.searchResultToInquirerChoices(searchResult);
					choices = choices.filter(item => !result.includes(item.value) && stack[item.value].Tick !== state);

					const choice = await prompt.searchResultPrompt(choices, row); // eslint-disable-line no-await-in-loop
					result.push(choice.result);
				}
			}
		}
	}

	result = [...new Set(result)];
	if (result.length > 0) {
		for (const row of result) {
			if (stack[row].Tick !== state) {
				stack[row].Tick = state;
			}
		}

		return stack;
	}

	return {};
};

exports.tickOneState = tickOneState;

/**
 * Untick all row except remove.
 *
 * @param {Object} stack - Store stack
 * @return {Object}
 */
exports.untickAll = stack => {
	utils.convertState(stack, 'tick', 'untick');
	utils.convertState(stack, 'remove', 'untick');

	return stack;
};

/**
 * Untick all remove rows.
 *
 * @param {Object} stack - Store stack
 * @return {Object}
 */
exports.unremoveAll = stack => {
	utils.convertState(stack, 'remove', 'untick');

	return stack;
};

/**
 * Tick all items from command.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} ticks - Store items need to check
 * @param {string[]} unticks - Store items need to uncheck
 * @param {string[]} removes - Store items need to remove
 * @return {Object]
 */
exports.tickAllState = async (stack, ticks, unticks, removes) => {
	let result;
	let empty = 0;

	result = await tickOneState(stack, ticks, 'tick');
	if (!utils.checkObjectEmpty(result)) {
		empty++;
	}

	result = await tickOneState(stack, unticks, 'untick');
	if (!utils.checkObjectEmpty(result)) {
		empty++;
	}

	result = await tickOneState(stack, removes, 'remove');
	if (!utils.checkObjectEmpty(result)) {
		empty++;
	}

	if (empty > 0) {
		return stack;
	}

	return result;
};

/**
 * Create row.
 *
 * @param {string} stackName Name of stack
 * @param {string} techName Name of tech
 * @param {string} tick Name of tick
 * @return {Object}
 */
const createRow = (stackName, techName, tick) => {
	let rowColor;

	switch (tick) {
		case 'remove':
			rowColor = 'gray';
			break;
		case 'tick':
			rowColor = 'green';
			break;
		case 'untick':
			rowColor = 'white';
			break;
		default:
			break;
	}

	stackName = chalk.keyword(rowColor)(stackName);
	techName = chalk.keyword(rowColor)(techName);
	tick = utils.tickSymbolByState(tick);

	return {[stackName]: [techName, tick]};
};

/**
 * Sort all rows from table.
 *
 * @param {Object} rows
 * @param {Object} args
 * @return {Object}
 */
const sortRows = (rows, args) => {
	if (args.sort === 'key') {
		rows = utils.sortByKey(rows, args.decrease);
	} else if (args.sort === 'value') {
		rows = utils.sortByValue(rows, args.decrease);
	}

	return rows;
};

/**
 * Display stack as table.
 *
 * @param {Object} stack - Store stack
 * @param {boolean} isAll - Show all stack even remove one
 */
exports.showTable = (stack, args) => {
	let rows = [];

	for (const stackName in stack) {
		if (utils.checkProperty(stack, stackName)) {
			const property = stack[stackName];
			const techName = property.Name;
			const tick = property.Tick;

			if (args.all || (tick !== 'remove' && techName !== 'None')) {
				const row = createRow(stackName, techName, tick);
				rows.push(row);
			}
		}
	}

	if (args.sort) {
		rows = sortRows(rows, args);
	}

	for (const element of rows) {
		table.push(element);
	}

	return table;
};

/**
 * Get state.
 *
 * @param {Object} stack - Store stack
 * @param {string} row - Name of stack
 * @return {Object}
 */
exports.getState = async (stack, rows) => {
	let result = [];
	const rowType = utils.checkEmpty(rows);

	if (rowType) {
		rows = rowType === 1 ? [rows] : [...new Set(rows)];

		for (const row of rows) {
			let found = false;

			if (result.includes(row)) {
				found = true;
			}

			if (!found && utils.checkProperty(stack, row)) {
				result.push(row);
				found = true;
			}

			if (!found) {
				const results = utils.getAllByValue(stack, row);

				if (results.length > 0) {
					result.push(...results);
					found = true;
				}
			}

			if (!found) {
				const fuseArray = utils.stackToFuseArray(stack);
				const searchResult = search.getFuzzy(fuseArray, row);

				if (searchResult.length > 0) {
					let choices = utils.searchResultToInquirerChoices(searchResult);
					choices = choices.filter(item => !result.includes(item.value));

					const choice = await prompt.searchResultPrompt(choices, row); // eslint-disable-line no-await-in-loop
					result.push(choice.result);
					found = true;
				}
			}
		}
	}

	result = [...new Set(result)];
	for (const line of result) {
		table.push({
			[line]: [stack[line].Name, utils.tickSymbolByState(stack[line].Tick)]
		});
	}

	return table;
};
