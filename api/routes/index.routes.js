const router = require('express').Router();

// Rutas para la autenticacion
router.use('/auth', require('./auth.routes'));

// Rutas para probar cosas
router.use('/test', require('./test.routes'));

// Rutas de los posts y algunas de comentarios
router.use('/post', require('./post.routes'));

// Rutas de comentarios independientes al post
router.use('/comment', require('./comment.routes'));

// Rutas de usuarios
router.use('/user', require('./user.routes'));

// Rutas de busqueda
router.use('/search', require('./search.routes'));

module.exports = router;