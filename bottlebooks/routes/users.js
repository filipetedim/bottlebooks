'use strict';

// Dependencies
const express = require('express');

// Models
const Users = require('../models/users');

// Business Logic
const UsersBL = require('../bl/users');

// Middlewares
const AuthTokens = require('../middlewares/auth/tokens');
const AuthUsers = require('../middlewares/auth/users');

// Endpoints
Users.methods(['get']);
Users
    .before('get', [AuthTokens.checkToken, AuthUsers.checkOwnAccess]);

// Routes
Users.route('register', ['post'], UsersBL.register);
Users.route('activate', ['get'], UsersBL.activate);
Users.route('login', ['post'], UsersBL.login);
Users.route('pendingusers', ['get'], UsersBL.getPendingUsers);

// Export restful object
module.exports = Users;
