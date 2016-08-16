var balanced = require('balanced-match');
var sizeOf = require('image-size');
var path = require('path');
var fs = require('fs');

module.exports = function(file, text, data, opts, handleFn) {

	opts.name = 'image';

	return handle(file, text, opts, handleFn);

};

function handle(file, content, opts, handleFn) {
	'use strict';

	var result = '';
	var reStart = new RegExp(opts.prefix + '[ ]*' + opts.name + ' ');
	var reEnd = new RegExp(opts.suffix);
	var matchStart;
	var matchArg;
	var safeStart;

	if (
		!opts.hasOwnProperty('context')
		|| !opts.context.hasOwnProperty('path')
		|| !opts.context.path.hasOwnProperty('images')
		|| !opts.context.hasOwnProperty('settings')
		|| !opts.context.settings.hasOwnProperty('path')
		|| !opts.context.settings.path.hasOwnProperty('images')
	) {
		throw new Error('options context.path.images and context.settings.path.images is required for image plugin');
	}

	try {
		fs.accessSync(opts.context.path.images, fs.F_OK);
	} catch (ex) {
		throw new Error('image dir path (context.path.images) is not exist');
	}

	while (matchStart = reStart.exec(content)) {
		safeStart = matchStart.index + matchStart[0].length - 1;

		matchArg = balanced(reStart, reEnd, content);

		let fileParams = matchArg.body.match(/(.*?)="(.*?)"\s?/g),
			paramsObj = fileParams.reduce(function (result, param) {
				result[param.split('=')[0]] = param.split('=')[1].trim();
				return result;
			}, {}),
			fileName = paramsObj.file,
			fileDimensions,
			img;

		if (fileName === undefined) {
			throw new Error('file - required property for image markup');
		} else {
			delete paramsObj.file;
			fileName = fileName.substring(1, fileName.length - 1);
			// Reflect.deleteProperty(paramsObj, 'file');
		}

		fileDimensions = sizeOf(path.resolve(opts.context.path.images, fileName));

		img = `<img src="${opts.context.settings.path.images}/${fileName}" `;
		img += `height=${fileDimensions.height} width=${fileDimensions.width} `;

		let attributesString = Object.keys(paramsObj).reduce(function (result, attributeName) {
			result += `${attributeName}=${paramsObj[attributeName]} `;
			return result;
		}, '');

		img += `${attributesString}>`;

		let start = content.substring(0, matchArg.start),
			end = content.substring(matchArg.end, content.length).replace(reEnd, '');

		content = start + img + end;
	}

	result += content;

	return result;
}
