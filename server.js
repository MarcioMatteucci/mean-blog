// 3rd party Modules
const mongoose = require('mongoose');

// Custom files
const app = require('./api/app');
const config = require('./config/config');

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.localDbUri, { useMongoClient: true }).then(
   () => { console.log('Conexion a la db: ' + config.localDbUri); },
   (err) => { console.log('Error al conectar a la db: ' + err); }
);

// Start server
app.listen(config.port, () => {
   console.log(`Server escuchando en el puerto ${config.port}`);
});