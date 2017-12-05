const router = require('express').Router();

// Rutas para la autenticacion
router.use('/auth', require('./authRoutes'));

// Rutas para probar la autenticacion y roles
router.use('/test', require('./testRoutes'));

module.exports = router;