const test = require('ava');
const chalk = require('chalk');
const progress = require('../bin/progress');

const stack = {
	Render: {
		Name: 'Client-Side',
		Tick: 'tick'
	},
	API: {
		Name: 'REST',
		Tick: 'untick'
	},
	'JS Framework': {
		Name: 'Vue',
		Tick: 'untick'
	}
};

test('Show progress bar base on number', t => {
	if (process.platform === 'win32') {
		t.is(progress.progressBar(24, 100), `Progress [${chalk.blue('====')}----------------] 24% | 24/100`);
	} else {
		t.is(progress.progressBar(24, 100), `Progress [${chalk.blue('\u2588\u2588\u2588\u2588')}\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591] 24% | 24/100`);
	}
});

test('Show progress bar base on stack', t => {
	if (process.platform === 'win32') {
		t.is(progress.progressTick(stack, false), `Progress [${chalk.blue('======')}--------------] 33% | 1/3`);
	} else {
		t.is(progress.progressTick(stack, false), `Progress [${chalk.blue('\u2588\u2588\u2588\u2588\u2588\u2588')}\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591] 33% | 1/3`);
	}
});
