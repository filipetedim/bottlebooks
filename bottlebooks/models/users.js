'use strict';

// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const UserSchema = mongoose.Schema({
    email: {type: String, required: true, lowercase: true, trim: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    token: String,
    settings: {
        authorization: String,
        active: {type: Boolean, default: false},
        activationDate: Date
    }
});

/**
 * Virtually adds the created_at property to the user.
 */
UserSchema.virtual('created_at').get(() => {
    return this._id.getTimestamp();
});

/**
 * Gets a user by its id.
 *
 * @memberOf Users
 *
 * @param _userId
 * @param next
 */
UserSchema.statics.getById = function (_userId, next) {
    this.findOne({_id: _userId}, (err, user) => {
        if (err){
            return next(err);
        }

        next(null, user);
    });
};

/**
 * Gets a user by its email.
 *
 * @memberOf Users
 *
 * @param email
 * @param next
 */
UserSchema.statics.getByEmail = function (email, next) {
    this.findOne({email: email}, (err, user) => {
        if (err){
            return next(err);
        }

        next(null, user);
    });
};

/** @class Users */
const Users = restful.model('Users', UserSchema);

// Return model
module.exports = Users;