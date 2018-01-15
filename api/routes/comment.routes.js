const router = require('express').Router();
const { check, validationResult, query } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const CommentsController = require('../controllers/comments.controller');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
   }

   next();
}

// // Todos los comentarios
// router.get('/', CommentsController.getAllComments);

// // Comentarios por id
// router.get('/:id', [
//    param('id').isMongoId().withMessage('No es un ID de comentario válido')
// ], CommentsController.getAllComments);

// Crear un comentario



module.exports = router;

