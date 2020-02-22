'use strict';

const httpError = require('../libraries/http-error');

module.exports = (req, res, next) => {
	next(httpError.method_not_allowed);
};
