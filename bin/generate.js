const {random, checkDeepProperty} = require('./utils');

const acceptTech = (hidden, tech) =>
	tech !== 'Name' && tech !== 'Hidden' && !hidden.includes(tech);

const generate = (techs, result, hidden) => {
	for (const tech in techs) {
		if (checkDeepProperty(techs, tech) && acceptTech(hidden, tech)) {
			const value = random(techs[tech]);

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

