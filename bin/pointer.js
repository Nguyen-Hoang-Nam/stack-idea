const fs = require('fs');
const path = require('path');

const {CONFIG} = require('./config');

const CONFIGLIST = path.join(__dirname, '..', '.stackconfigfile');
const STORELIST = path.join(__dirname, '..', '.stackfile');

/**
 * Add row to list of files.
 *
 * @param {string} file - Name of file
 * @param {string} fileName - Name of path
 */
exports.addRow = (file, fileName) => {
	const listFile = file === CONFIG ? CONFIGLIST : STORELIST;

	let list = fs.readFileSync(listFile, 'utf8');

	const dir = process.cwd();
	const filePath = path.join(dir, fileName);

	if (!list.includes(filePath)) {
		list += `\n${filePath}`;
	}

	fs.writeFileSync(listFile, list, 'utf8');
};

/**
 * Delete all file in list of file.
 *
 * @param {string} file - Name of file
 */
exports.deleteAllRow = file => {
	const listFile = file === CONFIG ? CONFIGLIST : STORELIST;

	const list = fs.readFileSync(listFile, 'utf8');
	const listArray = list.split('\n');

	for (const path of listArray) {
		if (fs.existSync(path)) {
			fs.unlinkSync(path);
		}
	}
};

