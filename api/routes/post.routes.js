const router = require('express').Router();
const { check, header, param, validationResult, query } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const auth = require('../middlewares/auth.middleware');

const PostsController = require('../controllers/posts.controller');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.arrary() });
   }

   next();
}

// Todos los posts
router.get('/', PostsController.getAllPosts);

// Posts por id
router.get('/:id', [
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, PostsController.getPostById);

// Crear un nuevo post
router.post('/', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   sanitize('title').trim(),
   sanitize('title').escape(),
   check('title', 'El título es requerido').exists(),
   check('title', 'El título debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('body').trim(),
   sanitize('body').escape(),
   check('body', 'El contenido es requerido').exists(),
   check('body', 'El contenido debe entre 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, PostsController.createPost);

// Darle like al post
router.post('/:id/like', [
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, auth.isAuth, PostsController.likePost);

// Darle dislike al post
router.post('/:id/dislike', [
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, auth.isAuth, PostsController.dislikePost);

// Actualizar un post
router.patch('/:id', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   sanitize('title').trim(),
   sanitize('title').escape(),
   check('title', 'El título es requerido').exists(),
   check('title', 'El título debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('body').trim(),
   sanitize('body').escape(),
   check('body', 'El contenido es requerido').exists(),
   check('body', 'El contenido debe entre 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, PostsController.updatePost);

// Eliminar un post
router.delete('/:id', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAuth, PostsController.deletePost);

module.exports = router;