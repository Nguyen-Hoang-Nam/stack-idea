const path = require('path');

const test = require('ava');
const file = require('../bin/file');

test('Get extension in local', t => {
	t.is(file.getExtension('yaml', false), 'yml');
});

test('Get extension in global', t => {
	t.is(file.getExtension('toml', true), 'json');
});

test('Get path in local', t => {
	t.is(file.getPath('stack', 'toml', false), './stack.toml');
});

test('Get path in global', t => {
	t.is(file.getPath('stack-config', 'toml', true), path.join(__dirname, '..', 'stack-config.toml'));
});
