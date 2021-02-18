const utils = require('../utils');
const treeify = require('treeify');

/**
 * Add tech to stack config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name stack in config
 * @param {(string | string[])} value - Items to add
 * @return {Obbject}
 */
const addItem = (config, property, value) => {
	const type = utils.checkEmpty(value);

	if (type && utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		let row = config;
		for (const element of component) {
			row = row[element];
		}

		if (type === 1) {
			row.push(value);
		} else if (type === 2) {
			for (const element of value) {
				row.push(element);
			}
		}
	}

	return config;
};

exports.addItem = addItem;

/**
 * Print row of config to screen.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
const getRow = (config, property) => {
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

exports.getRow = getRow;

/**
 * Remove item in stack config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @param {(string | string[])} value - Name of item
 * @return {Object}
 */
const removeItem = (config, property, value) => {
	const type = utils.checkEmpty(value);

	if (type && utils.checkDeepProperty(config, property)) {
		const path = utils.getPropertyPath(config, property);
		const component = utils.getPathComponent(path);

		let row = config;
		for (const element of component) {
			row = row[element];
		}

		if (type === 1) {
			utils.remove(row, value);
		} else if (type === 2) {
			utils.removeAll(row, value);
		}
	}

	return config;
};

exports.removeItem = removeItem;

/**
 * Add stack to config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @param {(string | string[])} value - List of item
 * @return {Object}
 */
const addRow = (config, property, value) => {
	const type = utils.checkEmpty(value);

	if (type && !utils.checkDeepProperty(config, property)) {
		if (type === 1) {
			config[property] = [value];
		} else if (type === 2) {
			config[property] = value;
		}
	}

	return config;
};

exports.addRow = addRow;

/**
 * Remove stack from config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 * @return {Object}
 */
const removeRow = (config, property) => {
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

exports.removeRow = removeRow;

/**
 * Hide stack in config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
const hiddenRow = (config, property) => {
	if (utils.checkDeepProperty(config, property)) {
		config.Hidden.push(property);
	}
};

exports.hiddenRow = hiddenRow;

/**
 * Show hidden stack in config.
 *
 * @param {Object} config - Store config
 * @param {string} property - Name of stack
 */
const showRow = (config, property) => {
	if (utils.checkDeepProperty(config, property) && config.Hidden.includes(property)) {
		utils.remove(config.Hidden, property);
	}
};

exports.showRow = showRow;

/**
 * Print confi to screen.
 *
 * @param {Object} config - Store config
 */
const getAll = config => {
	const treeObject = utils.configToTree(config, config.Hidden);

	console.log(treeify.asTree(treeObject, true));
};

exports.getAll = getAll;

exports.editCommand = (config, args) => {
	if (args['add-item']) {
		addItem(config, args['add-item'], args.item);
	} else if (args['remove-item']) {
		removeItem(config, args['remove-item'], args.item);
	} else if (args['get-row']) {
		getRow(config, args['get-row']);
	} else if (args['add-row']) {
		addRow(config, args['add-row'], args.item);
	} else if (args['remove-row']) {
		removeRow(config, args['remove-row']);
	} else if (args['hide-row']) {
		hiddenRow(config, args['hide-row']);
	} else if (args['show-row']) {
		showRow(config, args['show-row']);
	} else if (args['get-all']) {
		getAll(config);
	}

	return config;
};
