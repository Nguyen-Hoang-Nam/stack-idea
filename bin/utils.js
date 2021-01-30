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

const checkProperty = (result, key) => {
	return Object.prototype.hasOwnProperty.call(result, key);
};

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

exports.getPathComponent = path => {
	const component = path.split('.');
	component.shift();
	return component;
};

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

exports.tickOneOrMany = (mark, result, value) => {
	if (typeof mark === 'string') {
		if (checkProperty(result, mark)) {
			result[mark].Tick = value;
		}
	} else if (typeof mark === 'object') {
		mark.forEach(tech => {
			if (checkProperty(result, tech)) {
				result[tech].Tick = value;
			}
		});
	}

	return result;
};

exports.checkTick = (mark, result) => {
	if (typeof mark === 'string') {
		if (checkProperty(result, mark)) {
			return true;
		}
	} else if (Array.isArray(mark)) {
		for (const element of mark) {
			if (checkProperty(result, element)) {
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

exports.removeAll = (list, elements) => {
	for (const element of elements) {
		remove(list, element);
	}
};

exports.isManipulate = (args, manipulateList) => {
	for (const element of manipulateList) {
		if (args[element]) {
			return true;
		}
	}
};

exports.checkDeepProperty = checkDeepProperty;
exports.getPropertyPath = getPropertyPath;
