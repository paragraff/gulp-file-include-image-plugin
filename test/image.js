'use strict';

var image = require('../index.js');
var should = require('should');

describe('## image', function() {
	it('# basic', function(done) {
		var text = image(
			null,
			'content/*{image file="check-ajax.gif" alt="some description" class="process"}*/content',
			null,
			{
				prefix: '\\/\\*\\{\\$?',
				suffix: '\\}\\*\\/',
				context: {
					path: {
						images: 'test/fixtures'
					},
					settings: {
						path: {
							images: 'http://domain.name'
						}
					}
				}
			}
		);
		text.should.equal(
			'content<img src="http://domain.name/check-ajax.gif" height=64 width=64' +
			' alt="some description" class="process" >content'
		);
		done();
	});
});
