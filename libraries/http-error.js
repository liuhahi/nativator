'use strict';

module.exports = {
	invalid_request: {
		error: true,
		code: 400,
		type: 'invalid_request'
	},
	validationError: (params) => {
		return {
			error: true,
			code: 400,
			type: 'validation_error',
			params
		};
	},
	resource_not_found: {
		error: true,
		code: 404,
		type: 'resource_not_found'
	},
	method_not_allowed: {
		error: true,
		code: 405,
		type: 'method_not_allowed'
	},
	unknownError: (info) => {
		return {
			error: true,
			code: 500,
			type: 'unknown_error',
			info
		};
	},
	server_timeout: {
		error: true,
		code: 504,
		type: 'server_timeout'
	},
	//Additional Errors
	path_not_found: {
		error: true,
		code: 400,
		type: 'path_not_found'
	},
};
