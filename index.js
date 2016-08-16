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
	var matchArg;

	// check required options: paths
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

	//  create img tag for each image markup
	while (reStart.exec(content)) {

		// get image markup
		matchArg = balanced(reStart, reEnd, content);

		// get params from markup string
		let fileParams = matchArg.body.match(/(.*?)="(.*?)"\s?/g),
			paramsObj = fileParams.reduce(function (result, param) {
				result[param.split('=')[0]] = param.split('=')[1].trim();
				return result;
			}, {}),
			fileName = paramsObj.file;

		// check exist path to file in markup params
		if (fileName === undefined) {
			throw new Error('file - required property for image markup');
		} else {
			delete paramsObj.file;
			fileName = fileName.substring(1, fileName.length - 1);
			// Reflect is not defined in nodejs < 6
			// Reflect.deleteProperty(paramsObj, 'file');
		}

		content =
			// string before image markup
			content.substring(0, matchArg.start) +
			// new string instead image markup
			createImgTag(opts.context.settings.path.images, opts.context.path.images, fileName, paramsObj) +
			// string after image markup
			content.substring(matchArg.end, content.length).replace(reEnd, '');
	}

	result += content;

	return result;
}

function getAttirbutesSting(params) {
	return Object.keys(params)
		.reduce(function (result, attributeName) {
			result += `${attributeName}=${params[attributeName]} `;
			return result;
		}, '');
}

function createImgTag(domainName, pathToFile, fileName, paramsObj) {
	var fileDimensions = sizeOf(path.resolve(pathToFile, fileName));

	return `<img src="${domainName}/${fileName}" height=${fileDimensions.height} width=${fileDimensions.width} ` +
			`${getAttirbutesSting(paramsObj)}>`;
}
