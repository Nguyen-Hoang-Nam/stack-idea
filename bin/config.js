const chalk = require('chalk');

exports.minimistConfig = {
	alias: {
		h: 'help',
		v: 'version',
		g: 'generate',
		s: 'show',
		a: 'all',
		t: 'tick',
		u: 'untick',
		r: 'remove',
		G: 'global',
		y: 'yaml'
	}
};

exports.tableConfig = {
	head: [chalk.blue('Stack'), chalk.blue('Tech'), chalk.blue('Tick')],
	colAligns: ['left', 'left', 'center'],
	style: {compact: true, 'padding-left': 1, head: [], border: []}
};
