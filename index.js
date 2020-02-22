'use strict';

require('dotenv').config();

const cluster = require('cluster');

if (cluster.isMaster) {
	const cpus = require('os').cpus();
	
	cpus.forEach(() => {
		cluster.fork();
	});

	cluster.on('exit', () => {
		cluster.fork();
	});
} else {
	const httpError = require('./libraries/http-error');
	const errorHandler = require('./middlewares/error-handler');

	const helmet = require('helmet');
	const express = require('express');
	
	const app = express();
	app.use(helmet({
		noCache: true
	}));

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use((req, res, next) => {
		res.setTimeout(parseInt(process.env.TIMEOUT), () => {
			next(httpError.server_timeout);
		});
		next();
	});

	app.use('/paths', require('./routes/paths'));

	app.use((req, res, next) => {
		next(httpError.resource_not_found);
	});

	app.use(errorHandler);

	app.listen(process.env.PORT);
}