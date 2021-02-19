const utils = require('./utils');

/**
 * Check row valid.
 *
 * @param {string[]} hidden - Hidden stack
 * @param {string} tech - Name of tech
 * @return {boolean}
 */
const acceptTech = (hidden, tech) =>
	tech !== 'Name' && tech !== 'Hidden' && !hidden.includes(tech);

/**
 * Generate random stack from config.
 *
 * @param {Object} techs - Store all config
 * @param {Object} result - Store stack
 * @param {string[]} hidden - List of hidden items
 */
const generate = (techs, result, hidden) => {
	for (const tech in techs) {
		if (utils.checkDeepProperty(techs, tech) && acceptTech(hidden, tech)) {
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

