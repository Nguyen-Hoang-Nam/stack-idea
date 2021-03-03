const test = require('ava');
const cloneDeep = require('lodash.clonedeep');

const editConfig = require('../bin/stackConfig/edit');

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
	Hidden: []
};

test('Add item to stack-config', t => {
	const configClone = cloneDeep(config);

	t.deepEqual(editConfig.addItem(configClone, 'GraphQL Framework', 'Apollo'), {
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
							'Relay',
							'Apollo'
						]
					}
				]
			}
		],
		Database: [
			'Oracle',
			'MySQL'
		],
		Hidden: []
	});
});

test('Get row by stack name', t => {
	t.is(editConfig.getRow(config, 'GraphQL Framework'), 'GraphQL Framework : ["None","Relay"]');
});

test('Get row by value', t => {
	t.is(editConfig.getRow(config, 'MySQL'), 'Database : ["Oracle","MySQL"]');
});

test('Remove item from stack-config', t => {
	const configClone = cloneDeep(config);

	t.deepEqual(editConfig.removeItem(configClone, 'GraphQL Framework', 'Relay'), {
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
							'None'
						]
					}
				]
			}
		],
		Database: [
			'Oracle',
			'MySQL'
		],
		Hidden: []
	});
});

test('Add row to stack-config', t => {
	const configClone = cloneDeep(config);

	t.deepEqual(editConfig.addRow(configClone, 'Test', ['Jest', 'Ava']), {
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
		Test: ['Jest', 'Ava'],
		Hidden: []
	});
});

test('Remove row to stack-config', t => {
	const configClone = cloneDeep(config);

	t.deepEqual(editConfig.removeRow(configClone, 'API'), {
		Render: [
			{
				Name: 'Server-Side'
			},
			{
				Name: 'Client-Side'
			}
		],
		Database: [
			'Oracle',
			'MySQL'
		],
		Hidden: []
	});
});
