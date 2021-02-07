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
	if (typeof property === 'string') {
		if (checkProperty(stack, property)) {
			stack[property].Tick = state;
		}
	} else if (Array.isArray(property)) {
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
	if (typeof value === 'string') {
		if (checkValue(stack, value)) {
			tickOneByValue(stack, value, state, true);
		}
	} else if (Array.isArray(value)) {
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
 * Check properties exist in stack.
 *
 * @param {Object} stack - Store stack
 * @param {(string | string[])} property - Name of stack
 * @return {boolean}
 */
exports.checkOneOrManyByProperty = (stack, property) => {
	if (typeof property === 'string') {
		if (checkProperty(stack, property)) {
			return true;
		}
	} else if (Array.isArray(property)) {
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
	if (typeof value === 'string') {
		if (checkValue(stack, value)) {
			return true;
		}
	} else if (Array.isArray(value)) {
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

