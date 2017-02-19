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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, Authorization');
    next();
});

// Routes
app.use('/v1', require('./routes/v1'));
app.use('/app', require('./routes/public'));

// Run
app.listen(config.PORT);

console.log(`Server started on port ${config.PORT}`); // eslint-disable-line
