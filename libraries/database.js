'use strict';

module.exports = require('knex')({
	client: 'mysql2',
	version: process.env.DB_VERSION,
	connection: {
		host : process.env.DB_HOST,
		user : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		database : process.env.DB_DATABASE
    }
});