'use strict';

// Dependencies
const moment = require('moment');

// Models
const Events = require('../models/events');

/**
 * Creates an event.
 *
 * Checks if all data exists, and then validates the date.
 * Adds pertinent information to the request body, and continues with the route path.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 * @param {Function} next - callback
 */
const create = (req, res, next) => {
    if (!req.body.title || !req.body.description || !req.body.date) {
        return res.status(400).send({message: 'Missing params!'});
    }

    const date = req.body.date;

    // Check if date is valid
    if (!moment(date).isValid()) {
        return res.status(400).send({message: 'Invalid date!'});
    }
    
    // Add missing information and set the date as timestamp
    req.body.owner = {
        _userId: req.decoded._id,
        name: req.decoded.name
    };
    req.body.participants = [req.body.owner];
    req.body.date = moment(date).format('x');

    next();
};

/**
 * Hides information after getting all events.
 *
 * If the get request was to get all the events, hides the participants and owner id from the response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 * @param {Function} next - callback
 */
const getAll = (req, res, next) => {
    const token = req.decoded;
    
    if (!req.url.split('/')[2] && res && res.locals && res.locals.bundle) {
        res.locals.bundle.map(event => {
            event.owner._userId = undefined;
            event.participants = event.participants.reduce((prev, next) => {
                if (next._userId === token._id) {
                    prev.push(next);
                }
                return prev;
            }, []);
            return event;
        });
    }

    next();
};

/**
 * Adds the user to an event.
 *
 * All the information is already in the token.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the result object
 */
const participate = (req, res) => {
    if (!req.query._eventId) {
        return res.status(400).send({message: 'Missing params!'});
    }

    const _eventId = req.query._eventId;
    const token = req.decoded;

    Events.getById(_eventId, (err, event) => {
        if (err) {
            // TODO rollbar
            return res.status(500).send({message: 'Something went wrong!'});
        }

        // If event doesn't exist
        if (event === null) {
            return res.status(404).send({message: `Event doesn't exist!`});
        }

        // If user already in event
        if (event.participants.find(participant => participant._userId.toString() === token._id.toString())) {
            return res.status(400).send({message: 'User already in event!'});
        }

        event.participants.push({name: token.name, _userId: token._id});
        event.save(err => {
            if (err) {
                // TODO rollbar
                return res.status(500).send({message: 'Something went wrong!'});
            }

            res.send({message: 'User added to event!'});
        });
    });
};

// Exports functions
module.exports = {
    create,
    getAll,
    participate
};
