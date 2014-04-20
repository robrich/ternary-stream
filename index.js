'use strict';

var duplexer = require('duplexer');
var through2 = require('through2');
var ForkStream = require('fork-stream');

module.exports = function (condition, trueStream, falseStream) {
	if (!trueStream) {
		throw new Error('fork-stream: child action is required');
	}

	// output stream
	var outStream = through2.obj();

	// create fork-stream
	var forkStream = new ForkStream({
		classifier: function (e, cb) {
			var ans = !!condition(e);
			return cb(null, ans);
		}
	});

	// if condition is true, pipe input to trueStream
	forkStream.a.pipe(trueStream);
	// then send down-stream
	trueStream.pipe(outStream);

	if (falseStream) {
		// if there's an 'else' condition
		// if condition is false, pipe input to falseStream 
		forkStream.b.pipe(falseStream);
		// then send down-stream
		falseStream.pipe(outStream);
	} else {
		// if there's no 'else' condition
		// if condition is false, pipe down-stream 
		forkStream.b.pipe(outStream);
	}

	return duplexer(forkStream, outStream);
};
