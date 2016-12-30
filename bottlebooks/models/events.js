'use strict';

// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const EventSchema = mongoose.Schema({
    date: Date,
    owner: {
        name: String,
        _userId: String
    },
    title: String,
    description: String,
    participants: [{
        _userId: String,
        name: String
    }]
});

/**
 * Virtually adds the created_at property to the event.
 */
EventSchema.virtual('created_at').get(() => {
    return this._id.getTimestamp();
});

/**
 * Gets an event by its id.
 *
 * @memberOf Events
 *
 * @param _eventId
 * @param next
 */
EventSchema.statics.getById = function (_eventId, next) {
    this.findOne({_id: _eventId}, (err, event) => {
        if (err){
            return next(err);
        }

        next(null, event);
    });
};

/** @class Events */
const Events = restful.model('Events', EventSchema);

// Return model
module.exports = Events;