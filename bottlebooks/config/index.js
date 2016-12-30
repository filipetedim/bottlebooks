'use strict';

const config = require('./config');
const database = require('./database');

/**
 * Creates the url to connect to mlab.com.
 *
 * @return {String} - db url
 */
const getDbConnectionUrl = () => `mongodb://${database.USERNAME}:${database.PASSWORD}@${database.URL}`;

/**
 * Gets the root path.
 *
 * @return (String) - root path
 */
const getRootPath = () => __dirname.split('\\config')[0];

module.exports = {
    getDbConnectionUrl,
    getRootPath,
    PORT: config.PORT,
    SECRET: config.SECRET,
    TOKEN_VERSION: config.TOKEN_VERSION
};