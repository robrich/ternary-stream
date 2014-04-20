/*global describe:false, it:false */

'use strict';

var ternaryStream = require('../');

var through = require('through2');
require('should');

describe('ternary-stream', function() {
	describe('ternary,', function() {

		function runTest(answer, expected, done) {
			// arrange
			var called = 0;
			var theData = {the:'data'};

			var condition = function (data) {
				data.should.equal(theData);
				called++;
				return answer;
			};

			var trueStream = through.obj(function (data, enc, cb) {
				data.should.equal(theData);
				called+=10;
				this.push(data);
				cb();
			});
			var falseStream = through.obj(function (data, enc, cb) {
				data.should.equal(theData);
				called+=20;
				this.push(data);
				cb();
			});

			// act
			var s = ternaryStream(condition, trueStream, falseStream);

			s.once('data', function (data) {
				data.should.equal(theData);
				called+=100;
			});

			// assert
			s.once('end', function(){

				// Test that command executed
				called.should.equal(expected);
				done();
			});

			// act
			s.write(theData);
			s.end();
		}

		it('should call the function when passed truthy', function(done) {
			// arrange
			var answer = true;

			// act, assert
			runTest(answer, 111, done);
		});

		it('should not call the function when passed falsey', function(done) {
			// arrange
			var answer = false;

			// act, assert
			runTest(answer, 121, done);
		});
	});
});
