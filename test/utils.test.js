const test = require('ava');
const stripAnsi = require('strip-ansi');
const {tick, tickOneOrMany, checkTick, checkDeepProperty, getPropertyPath, getPathComponent} = require('../bin/utils');

const data = {
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

test('Show tick icon', t => {
	t.true(stripAnsi(tick('tick')) === '✔' || stripAnsi(tick('tick')) === '√');
});

test('Tick one tech', t => {
	t.deepEqual(tickOneOrMany('API', data, 'tick'), {
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

test('Tick many techs', t => {
	t.deepEqual(tickOneOrMany(['API', 'JS Framework'], data, 'tick'), {
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
			Tick: 'tick'
		}
	});
});

test('Check one tick', t => {
	t.is(checkTick('API', data), true);
});

test('Check many ticks', t => {
	t.is(checkTick(['API', 'JS Framework'], data), true);
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
