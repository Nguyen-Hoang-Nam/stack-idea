const test = require('ava');
const search = require('../bin/search');

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

test('Fuzzy search', t => {
	t.deepEqual(search.getFuzzy(fuseArray, 'Client'), [
		{
			item: {
				Stack: 'Render',
				Tech: 'Client-Side'
			},
			refIndex: 0
		}
	]);
});
