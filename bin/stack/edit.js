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
	let found = 0;
	if (utils.checkOneOrManyByProperty(stack, states)) {
		found++;
		utils.tickOneOrManyByProperty(stack, states, state);
	}

	if (utils.checkOneOrManyByValue(stack, states)) {
		if (typeof states === 'string' && found === 0) {
			await utils.tickOneOrManyByValue(stack, states, state);
		} else if (Array.isArray(states)) {
			await utils.tickOneOrManyByValue(stack, states, state);
		}

		found++;
	}

	if (typeof states === 'string' && found === 0 && search.checkFuzzy(stack, states)) {
		found++;
		await	search.tickFuzzy(stack, states, state);
	}

	if (found) {
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
 * Display stack as table.
 *
 * @param {Object} stack - Store stack
 * @param {boolean} isAll - Show all stack even remove one
 */
exports.showTable = (stack, args) => {
	const rows = [];

	for (let tech in stack) {
		if (utils.checkProperty(stack, tech)) {
			const line = stack[tech];
			let name = line.Name;

			if (args.all || (line.Tick !== 'remove' && name !== 'None')) {
				if (line.Tick === 'remove') {
					tech = chalk.gray(tech);
					name = chalk.gray(line.Name);
				} else if (line.Tick === 'tick') {
					tech = chalk.green(tech);
					name = chalk.green(line.Name);
				} else if (line.Tick === 'untick') {
					tech = chalk.white(tech);
					name = chalk.white(line.Name);
				}

				rows.push({
					[tech]: [name, utils.tickSymbolByState(line.Tick)]
				});
			}
		}
	}

	if (args.sort) {
		if (args.sort === 'key') {
			utils.sortByKey(rows);
		} else if (args.sort === 'value') {
			utils.sortByValue(rows);
		}
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
exports.getState = async (stack, row) => {
	if (utils.checkProperty(stack, row)) {
		table.push({
			[row]: [stack[row].Name, utils.tickSymbolByState(stack[row].Tick)]
		});
	} else if (utils.checkValue(stack, row)) {
		const result = utils.getAllByValue(stack, row);

		for (const line of result) {
			table.push({
				[line]: [stack[line].Name, utils.tickSymbolByState(stack[line].Tick)]
			});
		}
	} else if (search.checkFuzzy(stack, row)) {
		const result = search.getFuzzy(stack, row);
		if (result.length === 1) {
			const line = result.item.Stack;
			table.push({
				[line]: [stack[line].Name, utils.tickSymbolByState(stack[line].Tick)]
			});
		} else if (result.length > 1) {
			const choices = utils.searchResultToInquirerChoices(result);
			const choice = await prompt.searchResultPrompt(choices, row);

			const line = choice.result;
			table.push({
				[line]: [stack[line].Name, utils.tickSymbolByState(stack[line].Tick)]
			});
		}
	}

	return table;
};
