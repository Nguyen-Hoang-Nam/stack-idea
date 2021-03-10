const test = require('ava');
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
	t.is(progress.progressBar(24, 100), 'Progress [====----------------] 24%');
});

test('Show progress bar base on stack', t => {
	t.is(progress.progressTick(stack), 'Progress [======--------------] 33%');
});
