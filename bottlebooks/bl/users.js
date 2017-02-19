'use strict';

// Dependencies
const bcrypt = require('bcrypt-nodejs');
const config = require('../config');

// Models
const Users = require('../models/users');

// Middlewares
const AuthTokens = require('../middlewares/auth/tokens');

/**
 * Registers a user.
 *
 * Checks if all data exists, and then hashes the given password.
 * Attempts to save the user and mongoose will return an error if the email already exists.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 */
const register = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).send({message: 'Missing params!'});
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // Hash password
    bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        const newUser = new Users({
            email,
            name,
            password: hash,
            settings: {
                authorization: 'normal'
            }
        });

        // Save user, mongoose will send error if trying to register already existing email
        newUser.save(err => {
            if (err) {
                // Duplicate error (existing email)
                if (err.code === 11000) {
                    return res.status(400).send({message: 'Email already exists!'});
                }

                // TODO rollbar
                return res.status(500).send({message: 'Something went wrong!'});
            }

            res.status(201).send({message: 'User created successfully!'});
        });
    });
};

/**
 * Activates a user.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 */
const activate = (req, res) => {
    if (!req.query._userId) {
        return res.status(400).send({message: 'Missing params!'});
    }

    const _userId = req.query._userId;

    Users.getById(_userId, (err, user) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }
        
        // If user doesn't exist
        if (user === null) {
            return res.status(404).send({message: `User doesn't exist!`});
        }

        if (user.settings.active) {
            return res.status(400).send({message: 'User already activated!'});
        }

        // Parsing user to object to remove mongoose properties
        AuthTokens.validateToken(user.toObject(), (err, token) => {
            if (err) {
                return res.status(err.code).send({message: err.message});
            }

            // Set and save token, always do this because validateToken takes care of everything else
            user.token = token;
            user.settings.active = true;
            user.settings.activationDate = Date.now();
            user.save((err, updatedUser) => {
                if (err) {
                    // TODO rollbar
                    return res.status(500).send({message: 'Something went wrong!'});
                }

                // Hide password from frontend
                updatedUser.password = undefined; // eslint-disable-line

                res.send({authenticationData: updatedUser});
            });
        });
    });
};

/**
 * Logs a user.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 */
const login = (req, res) => {
    if (!req.headers.authorization) {
        return res.status(400).send({message: 'Missing header authorization!'});
    }

    const encoded = req.headers.authorization;
    const decoded = new Buffer(encoded, 'base64').toString('utf8');
    const email = decoded.split(':')[0].toLowerCase();
    const password = decoded.split(':')[1];
    
    Users.getByEmail(email, (err, user) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        if (user === null || user === undefined) {
            return res.status(400).send({message: 'Email does not exist!'});
        }

        bcrypt.compare(password, user.password, (err, valid) => {
            if (err) {
                // TODO rollbar
                return res.status(500).send({message: 'Something went wrong!'});
            }

            if (!valid) {
                return res.status(400).send({message: 'Wrong password!'});
            }

            if (!user.settings.active) {
                return res.status(400).send({message: 'User pending activation!'});
            }

            // Validate the token
            AuthTokens.validateToken(user.toObject(), (err, token) => {
                if (err) {
                    // TODO rollbar
                    return res.status(500).send({message: 'Something went wrong!'});
                }

                // Update token
                Users.update({_id: user._id}, {token: token}, err => {
                    if (err) {
                        // TODO rollbar
                        return res.status(500).send({message: 'Something went wrong!'});
                    }

                    // Do not send password to frontend
                    user = user.toObject();
                    user.password = undefined;
                    user.TOKEN_VERSION = config.TOKEN_VERSION;

                    res.send(user);
                });
            });
        });
    });
};

/**
 * Gets all the users that are pending.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 */
const getPendingUsers = (req, res) => {
    Users.find({settings: {active: false}}, (err, users) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        res.send(users);
    });
};

// Export functions
module.exports = {
    register,
    activate,
    login,
    getPendingUsers
};
