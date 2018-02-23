// 3rd party Modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');

// Custom files
const routes = require('./routes/index.routes');

// Express
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
   limits: { fileSize: 5 * 1024 * 1024 } // Max Size, mirar el valor de truncated
}));

// Static files

// Routes
app.use('/api', routes);

// Error handling
app.use((req, res, next) => {
   const error = new Error('Endpoint inválido');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500).json({ error: { msg: error.message } });
});

module.exports = app;