const {getPathComponent, checkDeepProperty, getPropertyPath} = require('./utils');

exports.addItem = (result, key, value) => {
	if (checkDeepProperty(result, key)) {
		const path = getPropertyPath(result, key);
		const component = getPathComponent(path);

		let row = result;
		for (const element of component) {
			row = row[element];
		}

		row.push(value);
	}

	return result;
};
