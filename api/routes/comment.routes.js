const router = require('express').Router();
const { check, header, param, validationResult, query } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const auth = require('../middlewares/auth.middleware');

const CommentsController = require('../controllers/comments.controller');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
   }

   next();
}

// Comentario por id
router.get('/:id', [
   param('id', 'No es un ID de comentario válido').isMongoId()
], checkErrors, CommentsController.getCommentById);

// Darle like al comentario
router.post('/:id/like', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de comentario válido').isMongoId()
], checkErrors, auth.isAuth, CommentsController.likeComment);

// Darle dislike al comentario
router.post('/:id/dislike', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de comentario válido').isMongoId()
], checkErrors, auth.isAuth, CommentsController.dislikeComment);

// Actualizar un comentario
router.patch('/:id', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty(),
   param('id', 'No es un ID de comentario válido').isMongoId(),
   sanitize('comment').trim(),
   sanitize('comment').escape(),
   check('comment', 'El comentario es requerido').exists(),
   check('comment', 'El comentario debe tener 3 caracteres mínimo').isLength({ min: 3 })
], checkErrors, auth.isAuth, CommentsController.updateComment);

module.exports = router;