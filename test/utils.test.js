const test = require('ava');
const stripAnsi = require('strip-ansi');
const {tick, tickOneOrMany} = require('../bin/utils');

test('Show tick icon', t => {
	t.true(stripAnsi(tick('tick')) === '✔' || stripAnsi(tick('tick')) === '√');
});

test('Tick one tech', t => {
	t.deepEqual(tickOneOrMany('foo', {foo: {Name: 'bar', Tick: 'untick'}}, 'tick'), {foo: {Name: 'bar', Tick: 'tick'}});
});
