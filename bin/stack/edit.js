const Table = require('cli-table');
const chalk = require('chalk');

const global = require('../global');
const utils = require('../utils');
const search = require('../search');

const table = new Table(global.tableConfig);

/**
 * Check name exist in stack.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} states - Store items
 * @return {boolean}
 */
const checkOneState = (stack, states) => {
	if (utils.checkOneOrManyByProperty(stack, states)) {
		return true;
	}

	if (utils.checkOneOrManyByValue(stack, states)) {
		return true;
	}

	if (typeof states === 'string' && search.checkFuzzy(stack, states)) {
		return true;
	}

	return false;
};

exports.checkOneState = checkOneState;

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
			utils.tickOneOrManyByValue(stack, states, state);
		} else if (Array.isArray(states)) {
			utils.tickOneOrManyByValue(stack, states, state);
		}

		found++;
	}

	if (typeof states === 'string' && found === 0 && search.checkFuzzy(stack, states)) {
		await	search.tickFuzzy(stack, states, state);
	}

	return stack;
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
 * Check all items from command exist.
 *
 * @param {Object} stack - Store stack
 * @param {string[]} ticks - Store items need to check
 * @param {string[]} unticks - Store items need to uncheck
 * @param {string[]} removes - Store items need to remove
 * @return {boolean}
 */
exports.checkAllState = (stack, ticks, unticks, removes) => {
	return checkOneState(stack, ticks) || checkOneState(stack, unticks) || checkOneState(stack, removes);
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
	stack = await tickOneState(stack, ticks, 'tick');
	stack = await tickOneState(stack, unticks, 'untick');
	stack = await tickOneState(stack, removes, 'remove');
	return stack;
};

/**
 * Display stack as table.
 *
 * @param {Object} stack - Store stack
 * @param {boolean} isAll - Show all stack even remove one
 */
exports.showTable = (stack, isAll) => {
	for (let tech in stack) {
		if (utils.checkDeepProperty(stack, tech)) {
			const line = stack[tech];
			let name = line.Name;

			if (isAll || (line.Tick !== 'remove' && name !== 'None')) {
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

				table.push({
					[tech]: [name, utils.tickSymbolByState(line.Tick)]
				});
			}
		}
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
exports.getState = (stack, row) => {
	if (utils.checkProperty(stack, row)) {
		table.push({
			[row]: [stack[row].Name, stack[row].Tick]
		});
	}

	return table;
};
