const test = require('ava');
const stripAnsi = require('strip-ansi');

const utils = require('../bin/utils');

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
	t.true(stripAnsi(utils.tickSymbolByState('tick')) === '✔' || stripAnsi(utils.tickSymbolByState('tick')) === '√');
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
	t.deepEqual(utils.stackToFuseArray(stack), fuseArray);
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
	t.deepEqual(utils.searchResultToInquirerChoices(fuseResult), [
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
	],
	Hidden: ['Database']
};

test('Check hidden row', t => {
	t.is(utils.acceptRow(config.Hidden, 'Database'), false);
});

test('Convert config object to treeify object', t => {
	t.deepEqual(utils.configToTree(config, config.Hidden), {
		'GraphQL Framework': 'None, Relay',
		API: 'REST, GraphQL',
		Render: 'Server-Side, Client-Side'
	});
});

test('Check property in nested object', t => {
	t.is(utils.checkDeepProperty(config, 'API'), true);
});

test('Get path of property in nested object', t => {
	t.is(utils.getPropertyPath(config, 'GraphQL Framework'), '.Render.1.API.1.GraphQL Framework');
});

test('Get components from path', t => {
	t.deepEqual(utils.getPathComponent('.Render.API.GraphQL Framework'), ['Render', 'API', 'GraphQL Framework']);
});
