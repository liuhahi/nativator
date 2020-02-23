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
		console.log('res is', res);
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
	function insertAt(path, i, letter) {
		return path.substring(0, i) + letter + path.substring(i + 1);
	}
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
		console.log("result is", result);
		let path = result.path;
		// CODE STARTS HERE
		/*
		Count the number of r and d in current path, if found l, or u, minus 1 respectively
		* */
		let total_r = 0;
		let total_d = 0;
		for (let i = 0; i < path.length; i++) {
			if (path.charAt(i) == "r") total_r += 1;
			else if (path.charAt(i) == "d") total_d += 1;
			else if (path.charAt(i) == "l") total_r -= 1;
			else if (path.charAt(i) == "u") total_d -= 1;
		}
		/* number of r and d should not exceed 4 in the string at any of the time */
		let max_r = 0;
		let max_d = 0;
		for (let i = 0; i < path.length; i++) {
			let added = false;
			switch (path.charAt(i)) {
				case "l":
					max_r -= 1;
					break;
				case "r":
					max_r += 1;
					break;
				case "u":
					max_d -= 1;
					break;
				case "d":
					max_d += 1;
					break;
				case "?":
					if (max_r < 4) {
						if (total_r < 4) {
							path = insertAt(path, i, 'r');
							added = true;
							max_r += 1;
							total_r += 1;
						}
					}
					if (added == false && max_d < 4) {
						if(total_d < 4){
							path = insertAt(path, i, 'd');
							added = true;
							max_d += 1;
							total_d += 1;
						}
					}
					if (added == false) {
						path = insertAt(path, i, 'u');
						max_d -= 1;
						total_d -= 1;
					}
					break;
				default:
					res.status(400);
			}
		}
		// CODE ENDS HERE
		res.status(200).json(path);
	} catch (error) {
		next(httpError.unknownError(error));
	}
};