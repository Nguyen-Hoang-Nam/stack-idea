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
		if (Object.prototype.hasOwnProperty.call(result, mark)) {
			result[mark].Tick = value;
		}
	} else if (typeof mark === 'object') {
		mark.forEach(tech => {
			if (Object.prototype.hasOwnProperty.call(result, tech)) {
				result[tech].Tick = value;
			}
		});
	}

	return result;
};

exports.helpCommand = (alias, mean, pad) => console.log(' ', alias.padEnd(pad), mean);

