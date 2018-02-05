const router = require('express').Router();
const { check, body, validationResult, query, header } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const usersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth.middleware');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
   }

   next();
}

router.post('/signUp', [
   sanitize('name').trim().escape(),
   body('name', 'El nombre es requerido').exists(),
   body('name', 'El nombre debe entre 2 y 30 caracteres').isLength({ min: 2, max: 30 }),
   sanitize('lastname').trim().escape(),
   body('lastname', 'El apellido es requerido').exists(),
   body('lastname', 'El apellido debe entre 2 y 50 caracteres').isLength({ min: 2, max: 50 }),
   sanitize('username').trim().escape(),
   body('username', 'El usuario es requerido').exists(),
   body('username', 'El usuario debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('password').trim().escape(),
   body('password', 'La contraseña es requerida').exists(),
   body('password', 'La contraseña debe entre 6 y 30 caracteres').isLength({ min: 6, max: 30 }),
   body('password', 'La contraseña no puede tener caracteres especiales (solo letras y números)').isAlphanumeric(),
   sanitize('email').trim().escape(),
   body('email', 'El email es requerido').exists(),
   body('email', 'No es un formato de email válido').isEmail(),
   sanitize('role').trim().escape(),
   body('role', 'No es un rol válido').optional().isIn(['admin', 'user'])
], checkErrors, usersController.signUp);

router.post('/signIn', [
   sanitize('username').trim().escape(),
   body('username', 'El usuario es requerido').exists(),
   sanitize('password').trim().escape(),
   body('password', 'La contraseña es requerida').exists(),
], checkErrors, usersController.signIn);

router.get('/refreshToken', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAuth, usersController.refreshToken);

router.get('/checkUsername', [
   query('username', 'El Nombre de Usuario es requerido').exists(),
   query('username', 'El usuario debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
], checkErrors, usersController.checkUsername);

router.get('/checkEmail', [
   query('email', 'El email es requerido').exists(),
   query('email', 'No es un formato de email válido').isEmail(),
], checkErrors, usersController.checkEmail);

module.exports = router;