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

test('Get row by stack name', async t => {
	const configClone = cloneDeep(config);
	const row = await editConfig.getRow(configClone, 'GraphQL Framework');

	t.is(row, 'GraphQL Framework : None, Relay');
});

test('Get row by value', async t => {
	const configClone = cloneDeep(config);
	const row = await editConfig.getRow(configClone, 'MySQL');

	t.is(row, 'Database : Oracle, MySQL');
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
