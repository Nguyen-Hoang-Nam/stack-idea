const test = require('ava');

const command = require('../bin/command');

test('Check command manipulate config file', t => {
	t.is(command.isManipulateStackConfig({'add-item': true}), true);
});

test('Check command manipulate stack file', t => {
	t.is(command.isManipulateStack({tick: true}), true);
});

