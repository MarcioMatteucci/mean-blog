// 3rd party Modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Custom files
const config = require('./api/config/database');
const routes = require('./api/routes');

// Express
const app = express();

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.localDbUri, { useMongoClient: true })
   .then(console.log('Conexion a la db: ' + config.localDbUri))
   .catch((err) => { console.log('Error al conectar a la db: ' + err) });

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files

// Routes
app.use('/api', routes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server escuchando en el puerto ${port}`);
});