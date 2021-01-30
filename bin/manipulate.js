const {getPathComponent, checkDeepProperty, getPropertyPath, remove, removeAll} = require('./utils');

exports.addItem = (result, key, value) => {
	if (checkDeepProperty(result, key)) {
		const path = getPropertyPath(result, key);
		const component = getPathComponent(path);

		let row = result;
		for (const element of component) {
			row = row[element];
		}

		if (typeof value === 'string') {
			row.push(value);
		} else if (Array.isArray(value)) {
			for (const element of value) {
				row.push(element);
			}
		}
	}

	return result;
};

exports.getRow = (result, key) => {
	if (checkDeepProperty(result, key)) {
		const path = getPropertyPath(result, key);
		const component = getPathComponent(path);

		let row = result;
		for (const element of component) {
			row = row[element];
		}

		console.log(key, ':', row);
	}
};

exports.removeItem = (result, key, value) => {
	if (checkDeepProperty(result, key)) {
		const path = getPropertyPath(result, key);
		const component = getPathComponent(path);

		let row = result;
		for (const element of component) {
			row = row[element];
		}

		if (typeof value === 'string') {
			remove(row, value);
		} else if (Array.isArray(value)) {
			removeAll(row, value);
		}
	}

	return result;
};

exports.addRow = (result, key, value) => {
	if (!checkDeepProperty(result, key)) {
		if (typeof value === 'string') {
			result[key] = [value];
		} else if (Array.isArray(value)) {
			result[key] = value;
		}
	}

	return result;
};

exports.removeRow = (result, key) => {
	if (checkDeepProperty(result, key)) {
		const path = getPropertyPath(result, key);
		const component = getPathComponent(path);

		if (component.length === 1) {
			delete result[key];
		} else {
			let parent = result;

			for (let i = 0; i < component.length - 1; i++) {
				parent = parent[component[i]];
			}

			delete parent[key];
		}
	}

	return result;
};

exports.hiddenRow = (result, key) => {
	if (checkDeepProperty(result, key)) {
		result.Hidden.push(key);
	}
};

exports.showRow = (result, key) => {
	if (checkDeepProperty(result, key) && result.Hidden.includes(key)) {
		remove(result.Hidden, key);
	}
};

exports.getAll = result =>
	console.log(result);
