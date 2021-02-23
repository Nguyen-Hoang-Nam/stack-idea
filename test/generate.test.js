const test = require('ava');
const rewiremock = require('rewiremock/node');

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

const mock = rewiremock.proxy(() => require('../bin/generate'), {
	'../bin/utils': {
		acceptRow: (hidden, tech) => tech !== 'Name' && !hidden.includes(tech),
		random: options => options[0],
		checkDeepProperty: () => true
	}
});

test('Generate new stack', t => {
	t.deepEqual(mock.generate(config, {}, []), {
		Render: {
			Name: 'Server-Side',
			Tick: 'untick'
		},
		Database: {
			Name: 'Oracle',
			Tick: 'untick'
		}
	});
});
