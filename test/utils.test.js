const test = require('ava');
const stripAnsi = require('strip-ansi');
const {tickSymbolByState, tickOneOrManyByProperty, tickOneOrManyByValue, checkOneOrManyByProperty, checkOneOrManyByValue, checkDeepProperty, getPropertyPath, getPathComponent, stackToFuseArray, searchResultToInquirerChoices} = require('../bin/utils');

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

// Manipulate stack fie
test('Show tick icon', t => {
	t.true(stripAnsi(tickSymbolByState('tick')) === '✔' || stripAnsi(tickSymbolByState('tick')) === '√');
});

test('Tick one row by property', t => {
	t.deepEqual(tickOneOrManyByProperty(stack, 'API', 'tick'), {
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

test('Tick many rows by property', t => {
	t.deepEqual(tickOneOrManyByProperty(stack, ['API', 'JS Framework'], 'remove'), {
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

test('Tick one row by value', t => {
	t.deepEqual(tickOneOrManyByValue(stack, 'REST', 'tick'), {
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

test('Tick many rows by value', t => {
	t.deepEqual(tickOneOrManyByValue(stack, ['Client-Side', 'Vue'], 'tick'), {
		Render: {
			Name: 'Client-Side',
			Tick: 'tick'
		},
		API: {
			Name: 'REST',
			Tick: 'tick'
		},
		'JS Framework': {
			Name: 'Vue',
			Tick: 'tick'
		}
	});
});

test('Check property exist', t => {
	t.is(checkOneOrManyByProperty(stack, 'API'), true);
});

test('Check properties exist', t => {
	t.is(checkOneOrManyByProperty(stack, ['API', 'JS Framework']), true);
});

test('Check value exist', t => {
	t.is(checkOneOrManyByValue(stack, 'REST'), true);
});

test('Check values exist', t => {
	t.is(checkOneOrManyByValue(stack, ['Client-Side', 'Vue']), true);
});

// Search

const fuseArray = [
	{
		Stack: 'Render',
		Tech: 'Client-Side'
	},
	{
		Stack: 'API',
		Tech: 'REST'
	},
	{
		Stack: 'JS Framework',
		Tech: 'Vue'
	}
];

test('Convert stack object to fuse array', t => {
	t.deepEqual(stackToFuseArray(stack), fuseArray);
});

const fuseResult = [
	{
		item: {
			Stack: 'Render',
			Tech: 'Client-Side'
		}
	},
	{
		item: {
			Stack: 'API',
			Tech: 'REST'
		}
	},
	{
		item: {
			Stack: 'JS Framework',
			Tech: 'Vue'
		}
	}
];

test('Convert fuse array to inquirer array', t => {
	t.deepEqual(searchResultToInquirerChoices(fuseResult), [
		{
			name: 'Render | Client-Side',
			value: 'Render'
		},
		{
			name: 'API | REST',
			value: 'API'
		},
		{
			name: 'JS Framework | Vue',
			value: 'JS Framework'
		}
	]);
});

const config = {
	Render: [
		{
			Name: 'Server-Side'
		},
		{
			Name: 'Client-Side',
			API: [
				{
					Name: 'REST'
				},
				{
					Name: 'GraphQL',
					'GraphQL Framework': [
						'None',
						'Relay'
					]
				}
			]
		}
	],
	Database: [
		'Oracle',
		'MySQL'
	]
};

test('Check property in nested object', t => {
	t.is(checkDeepProperty(config, 'API'), true);
});

test('Get path of property in nested object', t => {
	t.is(getPropertyPath(config, 'GraphQL Framework'), '.Render.1.API.1.GraphQL Framework');
});

test('Get components from path', t => {
	t.deepEqual(getPathComponent('.Render.API.GraphQL Framework'), ['Render', 'API', 'GraphQL Framework']);
});
