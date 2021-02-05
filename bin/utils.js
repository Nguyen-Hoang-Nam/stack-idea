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

exports.random = tech => {
	const length = tech.length;
	const position = Math.floor(Math.random() * length);
	return tech[position];
};

const symbol = name => {
	return process.platform === 'win32' ? symbols[name].window : symbols[name].linux;
};

/**
 *
 *
 */
const checkProperty = (result, key) => {
	return Object.prototype.hasOwnProperty.call(result, key);
};

const checkValue = (result, value) => {
	for (const element in result) {
		if (result[element].Name === value) {
			return true;
		}
	}

	return false;
};

// Manipulate stack-config file
const checkDeepProperty = (result, key) => {
	if (typeof result === 'object' && result !== null) {
		if (checkProperty(result, key)) {
			return true;
		}

		for (const property in result) {
			if (checkProperty(result, property) && property !== 'Name' && checkDeepProperty(result[property], key)) {
				return true;
			}
		}
	}

	return false;
};

exports.checkDeepProperty = checkDeepProperty;

const getPropertyPath = (result, key, path = '') => {
	if (Array.isArray(result)) {
		for (const [i, element] of result.entries()) {
			if (typeof element === 'object') {
				const value = getPropertyPath(element, key, `${path}.${i}`);

				if (value) {
					return value;
				}
			}
		}
	} else if (typeof result === 'object' && result !== null) {
		if (checkProperty(result, key)) {
			return `${path}.${key}`;
		}

		for (const property in result) {
			if (checkProperty(result, property) && property !== 'Name') {
				const value = getPropertyPath(result[property], key, `${path}.${property}`);

				if (value) {
					return value;
				}
			}
		}
	}

	return '';
};

exports.getPropertyPath = getPropertyPath;

exports.getPathComponent = path => {
	const component = path.split('.');
	component.shift();
	return component;
};

// Manipulate stack file
exports.tick = check => {
	if (check === 'untick') {
		return symbol('checkbox');
	}

	if (check === 'tick') {
		return symbol('tick');
	}

	if (check === 'remove') {
		return symbol('cross');
	}
};

exports.tickOneOrManyByProperty = (result, property, state) => {
	if (typeof property === 'string') {
		if (checkProperty(result, property)) {
			result[property].Tick = state;
		}
	} else if (Array.isArray(property)) {
		const temporary = [];
		for (const element of property) {
			if (checkProperty(result, element)) {
				result[element].Tick = state;
				temporary.push(element);
			}
		}

		removeAll(property, temporary);
	}

	return result;
};

const tickOneByValue = (result, value, state, isSingle = false) => {
	for (const element in result) {
		if (result[element].Name === value) {
			result[element].Tick = state;
			if (isSingle) {
				break;
			}
		}
	}
};

exports.tickOneOrManyByValue = (result, value, state) => {
	if (typeof value === 'string') {
		if (checkValue(result, value)) {
			tickOneByValue(result, value, state, true);
		}
	} else if (Array.isArray(value)) {
		const temporary = [];
		for (const element of value) {
			if (checkValue(result, element)) {
				tickOneByValue(result, element, state);
				temporary.push(element);
			}
		}

		removeAll(value, temporary);
	}

	return result;
};

exports.checkOneOrManyByProperty = (result, property) => {
	if (typeof property === 'string') {
		if (checkProperty(result, property)) {
			return true;
		}
	} else if (Array.isArray(property)) {
		for (const element of property) {
			if (checkProperty(result, element)) {
				return true;
			}
		}
	}

	return false;
};

exports.checkOneOrManyByValue = (result, value) => {
	if (typeof value === 'string') {
		if (checkValue(result, value)) {
			return true;
		}
	} else if (Array.isArray(value)) {
		for (const element of value) {
			if (checkValue(result, element)) {
				return true;
			}
		}
	}

	return false;
};

const remove = (list, element) => {
	const index = list.indexOf(element);
	if (index > -1) {
		list.splice(index, 1);
	}
};

exports.remove = remove;

const removeAll = (list, elements) => {
	for (const element of elements) {
		remove(list, element);
	}
};

exports.removeAll = removeAll;

exports.isManipulate = (args, manipulateList) => {
	for (const element of manipulateList) {
		if (args[element]) {
			return true;
		}
	}
};

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

