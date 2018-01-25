const router = require('express').Router();
const { check, body, header, param, validationResult, query } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const auth = require('../middlewares/auth.middleware');

const PostsController = require('../controllers/posts.controller');
const CommentsController = require('../controllers/comments.controller');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
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
   sanitize('title').trim().escape(),
   body('title', 'El título es requerido').exists(),
   body('title', 'El título debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('body').trim().escape(),
   body('body', 'El contenido es requerido').exists(),
   body('body', 'El contenido debe tener 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, PostsController.createPost);

// Darle like al post
router.post('/:id/like', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, auth.isAuth, PostsController.likePost);

// Darle dislike al post
router.post('/:id/dislike', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, auth.isAuth, PostsController.dislikePost);

// Actualizar un post
router.patch('/:id', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de post válido').isMongoId(),
   sanitize('title').trim().escape(),
   body('title', 'El título es requerido').exists(),
   body('title', 'El título debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('body').trim().escape(),
   body('body', 'El contenido es requerido').exists(),
   body('body', 'El contenido debe tener 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, PostsController.updatePost);

// Eliminar un post
router.delete('/:id', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, auth.isAuth, PostsController.deletePost);

/*=======================
Rutas de comentarios que
dependen de un post 
========================*/
// Crear un comentario en un post
router.post('/:id/comment', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de post válido').isMongoId(),
   sanitize('comment').trim().escape(),
   body('comment', 'El comentario es requerido').exists(),
   body('comment', 'El comentario debe tener 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, CommentsController.createComment);

// Todos los comentarios de un post
router.get('/:id/comment', [
   param('id', 'No es un ID de post válido').isMongoId()
], checkErrors, CommentsController.getCommentsByPost)

// Eliminar un comentario de un post y de la coleccion de comentarios
router.delete('/:postId/comment/:commentId', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('postId', 'No es un ID de post válido').isMongoId(),
   param('commentId', 'No es un ID de comentario válido').isMongoId()
], checkErrors, auth.isAuth, CommentsController.deleteComment)

module.exports = router;