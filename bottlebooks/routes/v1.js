'use strict';

// Dependencies
const express = require('express');

// Init
const router = express.Router(); // eslint-disable-line

// Routes
const Events = require('./events');
const Users = require('./users');

// Registrations
Events.register(router, '/events');
Users.register(router, '/users');

// Export router
module.exports = router;