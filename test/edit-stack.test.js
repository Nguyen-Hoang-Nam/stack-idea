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

