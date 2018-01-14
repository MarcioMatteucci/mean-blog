// 3rd party Modules
const mongoose = require('mongoose');

// Custom files
const app = require('./api/app');

// Environment
require('dotenv').config();

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.LOCALDB_URI, { useMongoClient: true }).then(
   () => { console.log('Conexion a la db: ' + process.env.LOCALDB_URI); },
   (err) => { console.log('Error al conectar a la db: ' + err); }
);

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
   console.log(`Server escuchando en el puerto ${port}`);
});