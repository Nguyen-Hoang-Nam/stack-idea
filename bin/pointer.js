const fs = require('fs');
const process = require('process');
const path = require('path');

const {CONFIG} = require('./config');

const CONFIGLIST = path.join(__dirname, '..', '.stackconfigfile');
const STORELIST = path.join(__dirname, '..', '.stackfile');

exports.addRow = (file, fileName) => {
	let listFile = '';

	if (file === CONFIG) {
		listFile = CONFIGLIST;
	} else {
		listFile = STORELIST;
	}

	let list = fs.readFileSync(listFile, 'utf8');

	const dir = process.cwd();
	const filePath = path.join(dir, fileName);

	if (!list.includes(filePath)) {
		list += `\n${filePath}`;
	}

	fs.writeFileSync(listFile, list, 'utf8');
};

exports.deleteAllRow = file => {
	let listFile = '';

	if (file === CONFIG) {
		listFile = CONFIGLIST;
	} else {
		listFile = STORELIST;
	}

	let list = fs.readFileSync(listFile, 'utf8');
	const listArray = list.split('\n');

	for (const path of listArray) {
		if (fs.existSync(path)) {
			fs.unlinkSync(path);
		}
	}
};

