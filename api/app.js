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

// Error handling
app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500).json({ error: { msg: error.message } });
});

module.exports = app;