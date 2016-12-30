'use strict';

// Dependencies
const express = require('express');

// Models
const Events = require('../models/events');

// Business Logic
const EventsBL = require('../bl/events');

// Middlewares
const AuthTokens = require('../middlewares/auth/tokens');
const AuthEvents = require('../middlewares/auth/events');

// Endpoints
Events.methods(['get', 'post']);
Events
    .before('get', [AuthTokens.checkToken, AuthEvents.checkUserAccess])
    .before('post', [AuthTokens.checkToken, EventsBL.create])
    .before('participate', [AuthTokens.checkToken]);

Events
    .after('get', [EventsBL.getAll])

// Routes
Events.route('participate', ['get'], EventsBL.participate);

// Export restful object
module.exports = Events;