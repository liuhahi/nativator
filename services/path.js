'use strict';

const database = require('../libraries/database');
const httpError = require('../libraries/http-error');

module.exports.getPaths = async (req, res, next) => {
	try {
		let paths = await database('paths');
		res.status(200).json(paths);
	} catch (error) {
		next(httpError.unknownError(error));
	}
};

module.exports.createPath = async (req, res, next) => {
	try {
		let path = res.input.path;
		await database('paths').insert({
			path
		});
		res.status(204).send();
	} catch (error) {
		next(httpError.unknownError(error));
	}
};

module.exports.deletePaths = async (req, res, next) => {
	try {
		await database('paths').where('id', '>', '3').del();
		await database.raw('ALTER TABLE paths AUTO_INCREMENT = 4');
		res.status(204).send();
	} catch (error) {
		next(httpError.unknownError(error));
	}
};

module.exports.navigate = async (req, res, next) => {
	try {
		let id = req.params.id;
		let result = await database('paths')
			.select('path')
			.where('id', id)
			.first();

		if (!result) {
			next(httpError.path_not_found);
		}
		// this is the path to navigate
		let path = result.path;
		// CODE STARTS HERE
		
		// CODE ENDS HERE
		res.status(200).json(path);
	} catch (error) {
		next(httpError.unknownError(error));
	}
};