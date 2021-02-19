const test = require('ava');
const cloneDeep = require('lodash.clonedeep');

const command = require('../bin/stack/edit');

const stack = {
	Render: {
		Name: 'Client-Side',
		Tick: 'untick'
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

test('Check exist property in state', t => {
	t.is(command.checkOneState(stack, 'API'), true);
});

test('Check exist value in state', t => {
	t.is(command.checkOneState(stack, 'Vue'), true);
});

test('Check exist fuzzy keywork in state', t => {
	t.is(command.checkOneState(stack, 'clent'), true);
});

test('Check exist property in states', t => {
	t.is(command.checkOneState(stack, ['Render', 'API']), true);
});

test('Check exist value in states', t => {
	t.is(command.checkOneState(stack, ['Client-Side', 'Vue']), true);
});

test('Tick exist property in state', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickOneState(stackClone, 'API', 'tick');

	t.deepEqual(result, {
		Render: {
			Name: 'Client-Side',
			Tick: 'untick'
		},
		API: {
			Name: 'REST',
			Tick: 'tick'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'untick'
		}
	});
});

test('Tick exist value in state', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickOneState(stackClone, 'Vue', 'remove');

	t.deepEqual(result, {
		Render: {
			Name: 'Client-Side',
			Tick: 'untick'
		},
		API: {
			Name: 'REST',
			Tick: 'untick'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'remove'
		}
	});
});

test('Tick exist property in states', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickOneState(stackClone, ['Render', 'JS Framework'], 'tick');

	t.deepEqual(result, {
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
			Tick: 'tick'
		}
	});
});

test('Tick exist value in states', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickOneState(stackClone, ['REST', 'Vue'], 'remove');

	t.deepEqual(result, {
		Render: {
			Name: 'Client-Side',
			Tick: 'untick'
		},
		API: {
			Name: 'REST',
			Tick: 'remove'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'remove'
		}
	});
});

test('Untick all rows', t => {
	const stackClone = {
		Render: {
			Name: 'Client-Side',
			Tick: 'tick'
		},
		API: {
			Name: 'REST',
			Tick: 'remove'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'untick'
		}
	};

	t.deepEqual(command.untickAll(stackClone), {
		Render: {
			Name: 'Client-Side',
			Tick: 'untick'
		},
		API: {
			Name: 'REST',
			Tick: 'remove'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'untick'
		}
	});
});

test('Unremove all rows', t => {
	const stackClone = {
		Render: {
			Name: 'Client-Side',
			Tick: 'tick'
		},
		API: {
			Name: 'REST',
			Tick: 'remove'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'untick'
		}
	};

	t.deepEqual(command.unremoveAll(stackClone), {
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
	});
});

test('Check exist property in all states', t => {
	t.is(command.checkOneState(stack, 'API', 'Render', 'Vue'), true);
});

test('Check exist property in all states of list items', t => {
	t.is(command.checkOneState(stack, ['API', 'Render'], ['REST'], ['Vue', 'Render']), true);
});

test('Tick exist property in all states', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickAllState(stackClone, 'API', 'Render', 'Vue');

	t.deepEqual(result, {
		Render: {
			Name: 'Client-Side',
			Tick: 'untick'
		},
		API: {
			Name: 'REST',
			Tick: 'tick'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'remove'
		}
	});
});

test('Tick exist property in all states of list items', async t => {
	const stackClone = cloneDeep(stack);

	const result = await command.tickAllState(stackClone, ['API', 'Render'], ['REST'], ['Vue', 'Render']);

	t.deepEqual(result, {
		Render: {
			Name: 'Client-Side',
			Tick: 'remove'
		},
		API: {
			Name: 'REST',
			Tick: 'untick'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'remove'
		}
	});
});

