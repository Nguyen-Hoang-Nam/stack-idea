const utils = require('../utils');

/**
 * Add tech to stack config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name stack in config
 * @param {(string | string[])} value - Items to add
 * @return {Obbject}
 */
exports.addItem = (config, property, value) => {
	if (utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		let row = config;
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

	return config;
};

/**
 * Print row of config to screen.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
exports.getRow = (config, property) => {
	if (utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		let row = config;
		for (const element of component) {
			row = row[element];
		}

		console.log(property, ':', row);
	}
};

/**
 * Remove item in stack config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @param {(string | string[])} value - Name of item
 * @return {Object}
 */
exports.removeItem = (config, property, value) => {
	if (utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		let row = config;
		for (const element of component) {
			row = row[element];
		}

		if (typeof value === 'string') {
			utils.remove(row, value);
		} else if (Array.isArray(value)) {
			utils.removeAll(row, value);
		}
	}

	return config;
};

/**
 * Add stack to config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @param {(string | string[])} value - List of item
 * @return {Object}
 */
exports.addRow = (config, property, value) => {
	if (!utils.checkDeepProperty(config, property)) {
		if (typeof value === 'string') {
			config[property] = [value];
		} else if (Array.isArray(value)) {
			config[property] = value;
		}
	}

	return config;
};

/**
 * Remove stack from config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @return {Object}
 */
exports.removeRow = (config, property) => {
	if (utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		if (component.length === 1) {
			delete config[property];
		} else {
			let parent = config;

			for (let i = 0; i < component.length - 1; i++) {
				parent = parent[component[i]];
			}

			delete parent[property];
		}
	}

	return config;
};

/**
 * Hide stack in config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
exports.hiddenRow = (config, property) => {
	if (utils.checkDeepProperty(config, property)) {
		config.Hidden.push(property);
	}
};

/**
 * Show hidden stack in config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
exports.showRow = (config, property) => {
	if (utils.checkDeepProperty(config, property) && config.Hidden.includes(property)) {
		utils.remove(config.Hidden, property);
	}
};

/**
 * Print confi to screen.
 *
 * @param {Object} config - Store config
 */
exports.getAll = config =>
	console.log(config);
