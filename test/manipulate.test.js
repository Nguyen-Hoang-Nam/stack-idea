const test = require('ava');

const {addItem, removeItem, addRow, removeRow} = require('../bin/manipulate');

const data = {
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

test('Add item to stack-config', t => {
	t.deepEqual(addItem(data, 'GraphQL Framework', 'Apollo'), {
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
		]
	});
});

test('Remove item from stack-config', t => {
	t.deepEqual(removeItem(data, 'GraphQL Framework', 'Relay'), {
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
							'Apollo'
						]
					}
				]
			}
		],
		Database: [
			'Oracle',
			'MySQL'
		]
	});
});

test('Add row to stack-config', t => {
	t.deepEqual(addRow(data, 'Test', ['Jest', 'Ava']), {
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
		Test: ['Jest', 'Ava']
	});
});

test('Remove row to stack-config', t => {
	t.deepEqual(removeRow(data, 'API'), {
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
		Test: ['Jest', 'Ava']
	});
});
