const test = require('ava');
const rewiremock = require('rewiremock/node');

const command = require('../bin/command');

const mock = rewiremock.proxy(() => require('../bin/command'), {
	'../bin/version': {
		version: '1.8.0'
	}
});

test('Check command manipulate config file', t => {
	t.is(command.isManipulateStackConfig({'add-item': true}), true);
});

test('Check command manipulate stack file', t => {
	t.is(command.isManipulateStack({tick: true}), true);
});

test('Show information of each command', t => {
	t.is(command.helpCommand('-p, --progress', 'Show progress of tick row'), ' -p, --progress          Show progress of tick row');
});

test('Get version auto update', t => {
	t.is(mock.version(), '1.8.0');
});
