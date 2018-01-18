const router = require('express').Router();

// Rutas para la autenticacion
router.use('/auth', require('./auth.routes'));

// Rutas para probar la autenticacion y roles
router.use('/test', require('./test.routes'));

// Rutas de los posts
router.use('/post', require('./post.routes'));

module.exports = router;