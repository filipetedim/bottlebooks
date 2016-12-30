'use strict';

// Dependencies
const express = require('express');
const config = require('../config');

// Init
const app = express();

// Endpoints
app.get('*', (req, res) => res.sendFile(config.getRootPath() + '/public/index.html'));

// Export router
module.exports = app;