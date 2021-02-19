const symbols = {
	tick: {
		linux: '✔',
		window: '√'
	},
	checkbox: {
		linux: '☐',
		window: '[ ]'
	},
	cross: {
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
exports.getAllByValue = (object, value) => {
	const result = [];
	for (const element in object) {
		if (object[element].Name === value) {
			result.push(element);
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
 * @param {} state
 * @return {string}
 */
exports.tickSymbolByState = state => {
	if (state === 'untick') {
		return symbol('checkbox');
	}

	if (state === 'tick') {
		return symbol('tick');
	}

	if (state === 'remove') {
		return symbol('cross');
	}
};

/**
 * Tick rows by property.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} property - Name of stack
 * @param {string} state - State of row
 * @return {Object}
 */
exports.tickOneOrManyByProperty = (stack, property, state) => {
	const type = checkEmpty(property);

	if (type === 1) {
		if (checkProperty(stack, property)) {
			stack[property].Tick = state;
		}
	} else if (type === 2) {
		const temporary = [];
		for (const element of property) {
			if (checkProperty(stack, element)) {
				stack[element].Tick = state;
				temporary.push(element);
			}
		}

		removeAll(property, temporary);
	}

	return stack;
};

/**
 * Tick one row by value.
 *
 * @param {Object} stack - Store stack
 * @param {string} value - Name of tech in stack
 * @param {string} state - State of stack
 * @param {boolean} isSingle
 */
const tickOneByValue = (stack, value, state, isSingle = false) => {
	for (const element in stack) {
		if (stack[element].Name === value) {
			stack[element].Tick = state;

			if (isSingle) {
				break;
			}
		}
	}
};

/**
 * Tick all matching rows by value.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} value - Name of tech in stack
 * @param {string} state - State of stack
 * @return {Object}
 */
exports.tickOneOrManyByValue = (stack, value, state) => {
	const type = checkEmpty(value);

	if (type === 1) {
		if (checkValue(stack, value)) {
			tickOneByValue(stack, value, state, true);
		}
	} else if (type === 2) {
		const temporary = [];
		for (const element of value) {
			if (checkValue(stack, element)) {
				tickOneByValue(stack, element, state);
				temporary.push(element);
			}
		}

		removeAll(value, temporary);
	}

	return stack;
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
 * Check properties exist in stack.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} property - Name of stack
 * @return {boolean}
 */
exports.checkOneOrManyByProperty = (stack, property) => {
	const type = checkEmpty(property);

	if (type === 1) {
		if (checkProperty(stack, property)) {
			return true;
		}
	} else if (type === 2) {
		for (const element of property) {
			if (checkProperty(stack, element)) {
				return true;
			}
		}
	}

	return false;
};

/**
 * Check values exist in stack.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} value - Name of tech in stack
 * @return {boolean}
 */
exports.checkOneOrManyByValue = (stack, value) => {
	const type = checkEmpty(value);

	if (type === 1) {
		if (checkValue(stack, value)) {
			return true;
		}
	} else if (type === 2) {
		for (const element of value) {
			if (checkValue(stack, element)) {
				return true;
			}
		}
	}

	return false;
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
 * Convert config object to tree object format.
 *
 * @param {Object} config Store all config
 * @param {Object} tree Tree object for treeify
 * @return {Object | string[]}
 */
const configToTree = (config, hidden, tree = {}) => {
	if (Array.isArray(config)) {
		let isStringArray = true;
		const values = [];

		for (const element of config) {
			if (typeof element === 'object') {
				isStringArray = false;
				values.push(element.Name);

				configToTree(element, hidden, tree);
			}
		}

		return isStringArray ? config : values;
	}

	if (typeof config === 'object' && config !== null) {
		for (const element in config) {
			if (checkProperty(config, element) && element !== 'Name' && element !== 'Hidden' && !hidden.includes(element)) {
				const value = configToTree(config[element], hidden, tree);

				tree[element] = JSON.stringify(value);
			}
		}
	}

	return tree;
};

exports.configToTree = configToTree;
