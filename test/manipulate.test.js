const test = require('ava');

const {addItem} = require('../bin/manipulate');

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
