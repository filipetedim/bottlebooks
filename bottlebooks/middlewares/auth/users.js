'use strict';

// Models
const Users = require('../../models/users');

/**
 * Checks if the token trying to access a certain user matches its id.
 * 
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - callback
 */
const checkOwnAccess = (req, res, next) => {
    const token = req.decoded;
    const _userId = req.params.id || req.query._userId || req.body._userId;

    if (!_userId) {
        return res.status(400).send({message: 'Missing params!'});
    }

    // Get user id from token
    Users.getById(token._id, (err, user) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        if (!user) {
            return res.status(404).send({message: 'User not found!'});
        }

        // Check if requested id and token id differ, using toString() because mongodb sometimes goes wtf
        if (user._id.toString() !== _userId.toString()) {
            // TODO rollbar warning someone trying to access what they shouldn't
            return res.status(403).send({message: 'Access denied'});
        }

        next();
    });
};

// Export functions
module.exports = {
    checkOwnAccess
};