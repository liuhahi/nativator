'use strict';

const Joi = require('@hapi/joi');
const httpError = require('../libraries/http-error');

const boolean = Joi.boolean().truthy('1').falsy('0');
const validPath = Joi.string().trim().regex(/^([udlr?])+$/).message('{{#label}}  must only contain u, d, l, r, ?');

module.exports.validator = (option) => {
	return async(req, res, next) => {
		try {
			let input = req.method === 'GET' ? req.query : req.body;

			let schema = typeof option === 'function' ? await option(res.context) : option;
			let { error, value } = schema.validate(input, {
				abortEarly: false,
				errors: {
					label: 'key'
				}
			});

			if (error) {
				let errors = [];
				error.details.forEach((detail) => {
					errors.push({
						label: detail.context.label,
						path: detail.path,
						type: detail.type,
						message: detail.message
					});
				});
				next(httpError.validationError(errors));
			} else {
				res.input = value;
				next();
			}
		} catch (error) {
			next(httpError.unknownError(error));
		}
	};
};


module.exports.schemas = {
	createPath: Joi.object({
		path: validPath.min(2).max(24).required()
	})
};