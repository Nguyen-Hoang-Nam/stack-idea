const utils = require('./utils');

/**
 * Generate random stack from config.
 *
 * @param {Object} techs - Store all config
 * @param {Object} result - Store stack
 * @param {string[]} hidden - List of hidden items
 */
const generate = (techs, result, hidden) => {
	for (const tech in techs) {
		if (utils.checkDeepProperty(techs, tech) && utils.acceptRow(hidden, tech)) {
			const value = utils.random(techs[tech]);

			if (typeof value === 'string') {
				result[tech] = {Name: value, Tick: 'untick'};
			} else {
				result[tech] = {Name: value.Name, Tick: 'untick'};

				result = generate(value, result, hidden);
			}
		}
	}

	return result;
};

exports.generate = generate;

