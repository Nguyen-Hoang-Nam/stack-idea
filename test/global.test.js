const test = require('ava');
const global = require('../bin/global');

test('Get search prompt config', t => {
	const choices = [
		{
			name: 'CSS Framework | Tailwind CSS',
			value: 'CSS Framework'
		},
		{
			name: 'CSS Preprocessor | Stylus',
			value: 'CSS Preprocessor'
		},
		{
			name: 'Modern CSS | Styled Component',
			value: 'Modern CSS'
		},
		{
			name: 'Message Broker | Kafka',
			value: 'Message Broker'
		},
		{
			name: 'Search | Elasticsearch',
			value: 'Search'
		},
		{
			name: 'JS Preprocessor | None',
			value: 'JS Preprocessor'
		}
	];

	t.deepEqual(global.searchPromptConfig('Choose the best match with (CSS)', choices), [{
		type: 'list',
		name: 'result',
		message: 'Choose the best match with (CSS)',
		choices
	}]);
});
