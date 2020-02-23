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
		let total_r = path.match(/r/g).length;
		if(path.match(/l/g) != null) {
			total_r -= path.match(/l/g).length;
		}
		let total_d = path.match(/d/g).length;
		if(path.match(/u/g) != null) {
			total_d -= path.match(/d/g).length;
		}
		for (let i = 0; i < path.length; i++) {
			if (path.charAt(i) == "l") {
				total_r -= 1;
			}
			else if (path.charAt(i) == "u") {
				total_d -= 1;
			}
			if (path.charAt(i) == "?") {
				if (total_r < 4) {
					path = path.substring(0, i) + 'r' + path.substring(i + 1);
					total_r += 1;
				} else if (total_d < 4) {
					path = path.substring(0, i) + 'd' + path.substring(i + 1);
					total_d += 1;
				} else {
					path = path.substring(0, i) + 'u' + path.substring(i + 1);
					total_d -= 1;
				}
			}
		}
		// CODE ENDS HERE
		res.status(200).json(path);
	} catch (error) {
		next(httpError.unknownError(error));
	}
};