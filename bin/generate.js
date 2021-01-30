const {random, checkDeepProperty} = require('./utils');

const generate = (techs, result) => {
	for (const tech in techs) {
		if (checkDeepProperty(techs, tech) && tech !== 'Name') {
			const value = random(techs[tech]);

			if (typeof value === 'string') {
				result[tech] = {Name: value, Tick: 'untick'};
			} else {
				result[tech] = {Name: value.Name, Tick: 'untick'};

				result = generate(value, result);
			}
		}
	}

	return result;
};

exports.generate = generate;

