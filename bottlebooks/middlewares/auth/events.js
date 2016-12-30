'use strict';

// Models
const Events = require('../../models/events');

/**
 * Checks if the token trying to access a certain event matches its owner id.
 * If the access is to get all the events, let it pass because participants will be hidden in the 'after'.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - callback
 */
const checkUserAccess = (req, res, next) => {
    const token = req.decoded;
    const _eventId = req.params.id || req.query._eventId || req.body._eventId;

    // If id exists validate, otherwise let it get all
    if (req.url.split('/')[2]) {
        if (!_eventId) {
            return res.status(400).send({message: 'Missing params!'});
        }

        Events.getById(_eventId, (err, event) => {
            if (err) {
                // TODO rollbar
                return res.status(500).send({message: 'Something went wrong!'});
            }

            if (!event) {
                return res.status(404).send({message: 'Event not found!'});
            }

            // Check if event owner id and token id differ, using toString() because mongodb sometimes goes wtf
            if (event.owner._userId.toString() !== token._id.toString()) {
                return res.status(403).send({message: 'Access denied!'});
            }

            next();
        });
    } else {
        next();
    }
};

// Export functions
module.exports = {
    checkUserAccess
};