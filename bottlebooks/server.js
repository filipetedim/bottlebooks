'use strict';

// Dependencies
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Init
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.getDbConnectionUrl());

// Middlewares
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// Routes
app.use('/v1', require('./routes/v1'));
app.use('/app', require('./routes/public'));

// Run
app.listen(config.PORT);

console.log(`Server started on port ${config.PORT}`); // eslint-disable-line