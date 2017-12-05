// 3rd party Modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Custom files
const routes = require('./routes');

// Express
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files

// Routes
app.use('/api', routes);

module.exports = app;