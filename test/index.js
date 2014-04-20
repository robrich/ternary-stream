/*global describe:false, it:false */

'use strict';

var ternaryStream = require('../');

var through = require('through2');
var should = require('should');

describe('ternary-stream', function() {
	describe('smoke test', function() {

		it('should call the function when passed truthy', function(done) {
			// arrange
			var called = 0;

			var condition = function (data) {
				return data.answer;
			};

			var childStream = through.obj(function (data, enc, cb) {
				called++;
				this.push(data);
				cb();
			});

			// act
			var s = ternaryStream(condition, childStream);

			s.on('data', function (/*data*/) {
				called += 10;
			});

			// assert
			s.once('end', function(){

				// Test that command executed
				called.should.equal(21);
				done();
			});

			// act
			s.write({answer:true});
			s.write({answer:false});
			s.end();
		});

		it('should error if no parameters passed', function(done) {
			// arrange
			var caughtErr;

			// act
			try {
				ternaryStream();
			} catch (err) {
				caughtErr = err;
			}

			// assert
			should.exist(caughtErr);
			caughtErr.message.indexOf('required').should.be.above(-1);
			done();
		});

	});
});
