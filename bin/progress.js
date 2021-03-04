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

	return `Progress [${'='.repeat(progress)}${'-'.repeat(20 - progress)}] ${percent}%`;
};

exports.progressBar = progressBar;


/**
 * Create progress bar for tick row
 *
 * @param {Object} stack Store all row
 * @return {string}
 */
exports.progressTick = stack => {
	const total = utils.countTotalProperty(stack);
	const tick = utils.countTickProperty(stack);

	return progressBar(tick, total);
};
