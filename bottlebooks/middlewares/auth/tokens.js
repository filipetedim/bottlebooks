'use strict';

// Dependencies
const config = require('../../config');
const jwt = require('jsonwebtoken');
const rollbar = require('rollbar');

// Models
const Users = require('../../models/users');

// Middlewares
const Utils = require('../utils');

/**
 * Checks the token.
 *
 * Verifies if the token exists and retrieves user information to attach to request, used for next routes/functions.
 * If the token version doesn't match or the token has expired, logs out the user and on login gets updated.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - callback
 */
const checkToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!Utils.exists(token)) {
        return res.status(403).send({message: 'No token provided!'});
    }

    // Check token
    jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err && err.name !== 'TokenExpiredError') {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        // If token expired or wrong version, logout the user
        if ((err && err.name === 'TokenExpiredError') || decoded.TOKEN_VERSION !== config.TOKEN_VERSION) {
            // Personal status, to logout user
            return res.status(430).send({message: 'Old token, requires logout!'});
        }

        // Search and validate user of token
        Users.findOne({_id: decoded._id, token: token}, (err, user) => {
            if (err) {
                // TODO rollbar
                console.log("hai");
                return res.status(500).send({message: 'Something went wrong!'});
            }

            // Different than null because might come in other states
            if (user !== null) {
                // Attach info for other routes and requests
                req.decoded = decoded;
                return next();
            }

            // TODO rollbar user id in token doesn't exist
            res.send(401).send({message: 'Failed to authenticate token!'});
        })
    });
};

/**
 * Validates the token of a user.
 *
 * If no token exists, creates one.
 * Else, if the token has expired or is in the wrong version, creates a new one.
 * If none of the above, just returns the current token.
 *
 * @param {Object} user - the user data
 * @param {Function} next - callback
 */
const validateToken = (user, next) => {
    // If token doesn't exist (usually activating)
    if (user.token === null || user.token === undefined) { // eslint-disable-line
        return createNewToken(user, token => next(null, token));
    }

    // Check if token exists and its version
    jwt.verify(user.token, config.SECRET, (err, decoded) => {
        // Any error except expired
        if (err && err.name !== 'TokenExpiredError') {
            // TODO rollbar
            return next({code: 500, message: 'Something went wrong!'});
        }
        
        // If token expired or wrong version
        if ((err && err.name === 'TokenExpiredError') || decoded.TOKEN_VERSION !== config.TOKEN_VERSION) {
            return createNewToken(user, token => next(null, token));
        }
        
        // If token is valid
        next(null, user.token);
    });
};

/**
 * Creates a new token with user data.
 *
 * Removes the password and old token.
 * Adds the token version. This is used to control users who haven't refreshed the page on new app versions.
 * Converts the object into a token and returns it.
 *
 * @param {Object} user - the user data
 * @param {Function} next - callback
 */
const createNewToken = (user, next) => {
    let tokenData = user;
    
    // Clear unwanted data and add new required info
    tokenData.password = undefined; // eslint-disable-line
    tokenData.token = undefined; // eslint-disable-line
    tokenData.settings = undefined; // eslint-disable-line
    tokenData.TOKEN_VERSION = config.TOKEN_VERSION;

    const token = jwt.sign(tokenData, config.SECRET, {
        expiresInDays: 366
    });

    next(token);
};

// Export functions
module.exports = {
    checkToken,
    validateToken
};