const router = require('express').Router();

// Rutas para la autenticacion
router.use('/auth', require('./auth.routes'));

// Rutas para probar la autenticacion y roles
router.use('/test', require('./test.routes'));

module.exports = router;