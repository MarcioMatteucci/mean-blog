// 3rd party Modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Custom files
const app = require('./api/app');

// Variables de entorno
dotenv.config();

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.LOCALDB_URI, { useMongoClient: true }).then(
   () => { console.log('Conexion a la db: ' + process.env.LOCALDB_URI); },
   (err) => { console.log('Error al conectar a la db: ' + err); }
);

// Start server
app.listen(process.env.PORT, () => {
   console.log(`Server escuchando en el puerto ${process.env.PORT}`);
});