const chalk = require('chalk');

/**
 * Not exist file.
 *
 * @param {string} file - Name of file
 */
exports.noFile = file => console.log(chalk.yellow(`There are no ${file}.json or ${file}.yml in both global and local`));

/**
 * Successfull message.
 */
exports.successGenerate = () => console.log(
	chalk.green('Generate successful, check your stack.json or stack --show to show stack')
);
