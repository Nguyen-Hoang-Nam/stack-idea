const chalk = require('chalk');
const utils = require('./utils');

/**
 * Create progress bar
 *
 * @param {number} archive
 * @param {number} total
 * @return {string}
 */
const progressBar = (archive, total) => {
	const percent = Math.round(archive * 100 / total);
	const progress = Math.round(percent / 10) * 2;

	return `Progress [${chalk.blue('=').repeat(progress)}${'-'.repeat(20 - progress)}] ${percent}% | ${archive}/${total}`;
};

exports.progressBar = progressBar;

/**
 * Create progress bar for tick row
 *
 * @param {Object} stack Store all row
 * @return {string}
 */
exports.progressTick = (stack, args) => {
	const total = utils.countTotalProperty(stack, !args.all);
	const tick = utils.countTickProperty(stack);

	return progressBar(tick, total);
};
