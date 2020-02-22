'use strict';

const httpError = require('../libraries/http-error');

module.exports = async(err, req, res, next) => {
	if (err instanceof SyntaxError) {
		err = httpError.invalid_request;
	}
	if (err.type === 'unknown_error') {
		console.log(err.info);
		err.info = err.info.toString();
	}
	res.status(err.code).json(err);
};
