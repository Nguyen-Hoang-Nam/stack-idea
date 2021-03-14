const chalk = require('chalk');

const symbols = {
	tick: {
		linux: '✔',
		window: '√'
	},
	untick: {
		linux: '☐',
		window: '[ ]'
	},
	remove: {
		linux: '✖',
		window: '×'
	}
};

/**
 * Generate random element from array.
 *
 * @param {string[]} options - List of options
 * @return {string}
 */
exports.random = options => {
	const length = options.length;
	const position = Math.floor(Math.random() * length);

	return options[position];
};

/**
 * Generate symbol for both window and linux.
 *
 * @param {sting} name - Name of symbol
 * @return {string}
 */
const symbol = name => {
	return process.platform === 'win32' ? symbols[name].window : symbols[name].linux;
};

/**
 * Check property exist in object.
 *
 * @param {Object} object
 * @param {string} property
 * @return {boolean}
 */
const checkProperty = (object, property) => {
	return Object.prototype.hasOwnProperty.call(object, property);
};

exports.checkProperty = checkProperty;

/**
 * Check value exist in object.
 *
 * @param {Object} object
 * @param {string} value
 * @return {boolean}
 */
const checkValue = (object, value) => {
	for (const element in object) {
		if (object[element].Name === value) {
			return true;
		}
	}

	return false;
};

exports.checkValue = checkValue;

/**
 * Get all property by value.
 *
 * @param {Object} object Store all row
 * @param {string} value
 * @return {string[]}
 */
const getAllByValue = (object, value) => {
	const result = [];
	for (const element in object) {
		if (object[element].Name === value) {
			result.push(element);
		}
	}

	return result;
};

exports.getAllByValue = getAllByValue;

exports.getAllByState = (stack, state) => {
	const result = [];
	for (const row in stack) {
		if (stack[row].Tick === state) {
			result.push(row);
		}
	}

	return result;
};

/**
 * Check empty value to reduce recursive.
 *
 * @param {string | string[]} value Store value need to check
 * @return {number}
 */
const checkEmpty = value => {
	if (typeof value === 'string' && value !== '') {
		return 1;
	}

	if (Array.isArray(value) && value.length > 0) {
		return 2;
	}

	return 0;
};

exports.checkEmpty = checkEmpty;

/**
 * Check object empty
 *
 * @param {Object} object
 * @return {boolean}
 */
exports.checkObjectEmpty = object => {
	for (const i in object) {
		if (checkProperty(object, i)) {
			return false;
		}
	}

	return true;
};

// Manipulate stack-config file

/**
 * Check property exist in nested object.
 *
 * @param {Object} object
 * @param {string} property
 * @return {boolean}
 */
const checkDeepProperty = (object, property) => {
	if (typeof object === 'object' && object !== null) {
		if (checkProperty(object, property)) {
			return true;
		}

		for (const element in object) {
			if (checkProperty(object, element) && element !== 'Name' && checkDeepProperty(object[element], property)) {
				return true;
			}
		}
	}

	return false;
};

exports.checkDeepProperty = checkDeepProperty;

/**
 * Get path to property in object.
 *
 * @param {Object} object
 * @param {string} property
 * @param {string} path
 * @return {string}
 */
const getPropertyPath = (object, property, path = '') => {
	if (Array.isArray(object)) {
		for (const [i, element] of object.entries()) {
			if (typeof element === 'object') {
				const value = getPropertyPath(element, property, `${path}.${i}`);

				if (value) {
					return value;
				}
			}
		}
	} else if (typeof object === 'object' && object !== null) {
		if (checkProperty(object, property)) {
			return `${path}.${property}`;
		}

		for (const element in object) {
			if (checkProperty(object, element) && element !== 'Name') {
				const value = getPropertyPath(object[element], property, `${path}.${element}`);

				if (value) {
					return value;
				}
			}
		}
	}

	return '';
};

exports.getPropertyPath = getPropertyPath;

/**
 * Get component from property's path.
 *
 * @param {string} path
 * @return {string[]}
 */
exports.getPathComponent = path => {
	const component = path.split('.');
	component.shift();

	return component;
};

// Manipulate stack file

/**
 * Generate symbol from state.
 *
 * @param {string} state Store state of the row
 * @return {string}
 */
exports.tickSymbolByState = state => {
	return symbol(state);
};

/**
 * Convert old state of row to new state.
 *
 * @param {Object} stack - Store stack
 * @param {string} oldState - Old state of row
 * @param {string} newState - New state of row
 * @return {Object}
 */
exports.convertState = (stack, oldState, newState) => {
	for (const row in stack) {
		if (checkProperty(stack, row) && stack[row].Tick === oldState) {
			stack[row].Tick = newState;
		}
	}

	return stack;
};

/**
 * Remove element in list.
 *
 * @param {string[]} list
 * @param {string} element
 */
const remove = (list, element) => {
	const index = list.indexOf(element);
	if (index > -1) {
		list.splice(index, 1);
	}
};

exports.remove = remove;

/**
 * Remove list of elements in list.
 *
 * @param {string[]} list
 * @param {string[]} elements
 */
const removeAll = (list, elements) => {
	for (const element of elements) {
		remove(list, element);
	}
};

exports.removeAll = removeAll;

/**
 * Check command is manipulate command.
 *
 * @param {Object} args - Store argument of command
 * @param {string[]} manipulateList - Store list of manipulate command
 * @return {boolean}
 */
exports.isManipulate = (args, manipulateList) => {
	for (const element of manipulateList) {
		if (args[element]) {
			return true;
		}
	}

	return false;
};

/**
 * Sort row in table by key
 *
 * @param {Object} rows Store all rows
 * @param {boolean} isDecreasing
 * @return {Object}
 */
exports.sortByKey = (rows, isDecreasing) => {
	rows.sort((row1, row2) => {
		const stack1 = Object.keys(row1)[0];
		const stack2 = Object.keys(row2)[0];

		return (isDecreasing ? -1 : 1) * stack1.localeCompare(stack2);
	});

	return rows;
};

/**
 * Sort row in table by value
 *
 * @param {Object} rows Store al rows
 * @param {boolean} isDecreasing
 * @return {Object}
 */
exports.sortByValue = (rows, isDecreasing) => {
	rows.sort((row1, row2) => {
		const stack1 = Object.values(row1)[0];
		const stack2 = Object.values(row2)[0];

		return (isDecreasing ? -1 : 1) * stack1[0].localeCompare(stack2[0]);
	});

	return rows;
};

/**
 * Count number of property in object
 *
 * @param {Object} object
 * @return {number}
 */
exports.countTotalProperty = (object, hidden) => {
	let count = 0;
	for (const property in object) {
		if (checkProperty(object, property) && object[property].Name !== 'None') {
			count += hidden ? (object[property].Tick === 'remove' ? 0 : 1) : 1;
		}
	}

	return count;
};

/**
 * Count number of tick row in object
 *
 * @param {Object} object
 * @return {number}
 */
exports.countTickProperty = object => {
	let count = 0;
	for (const property in object) {
		if (checkProperty(object, property) && object[property].Tick === 'tick') {
			count++;
		}
	}

	return count;
};

// Search

/**
 * Convert stack to Fuse array.
 *
 * @param {Object} stack - Store stack
 * @return {Object[]}
 */
exports.stackToFuseArray = stack => {
	const fuseArray = [];

	for (const element in stack) {
		if (checkProperty(stack, element)) {
			const item = {
				Stack: element,
				Tech: stack[element].Name
			};

			fuseArray.push(item);
		}
	}

	return fuseArray;
};

/**
 * Convert Fuse search result to Inquirer choices array.
 *
 * @param {Object[]} searchResult - Fuse search result
 * @return {Object[]}
 */
exports.searchResultToInquirerChoices = searchResult => {
	const inquirerChoices = [];

	for (const element of searchResult) {
		const item = {
			name: `${element.item.Stack} | ${element.item.Tech}`,
			value: element.item.Stack
		};

		inquirerChoices.push(item);
	}

	return inquirerChoices;
};

// Manipulate stack config

/**
 * Check row valid.
 *
 * @param {string[]} hidden - Hidden stack
 * @param {string} tech - Name of tech
 * @return {boolean}
 */
const acceptRow = (hidden, tech) =>
	tech !== 'Name' && tech !== 'Hidden' && !hidden.includes(tech);

exports.acceptRow = acceptRow;

/**
 * Convert config object to tree object format.
 *
 * @param {Object} config Store all config
 * @param {Object} tree Tree object for treeify
 * @return {Object | string[]}
 */
const configToTree = (config, hidden, isColor = false, tree = {}) => {
	if (Array.isArray(config)) {
		let isStringArray = true;
		const values = [];

		for (const element of config) {
			if (typeof element === 'object') {
				isStringArray = false;
				values.push(element.Name);

				configToTree(element, hidden, isColor, tree);
			}
		}

		return isStringArray ? config : values;
	}

	if (typeof config === 'object' && config !== null) {
		for (const element in config) {
			if (checkProperty(config, element) && acceptRow(hidden, element)) {
				const value = configToTree(config[element], hidden, isColor, tree);

				if (isColor) {
					tree[chalk.blue(element)] = value.join(', ');
				} else {
					tree[element] = value.join(', ');
				}
			}
		}
	}

	return tree;
};

exports.configToTree = configToTree;
