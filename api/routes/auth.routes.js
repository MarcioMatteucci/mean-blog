const router = require('express').Router();
const { check, validationResult, query } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const usersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth.middleware');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
   }

   next();
}

router.post('/signUp', [
   sanitize('name').trim(),
   sanitize('name').escape(),
   check('name', 'El nombre es requerido').exists(),
   check('name', 'El nombre debe entre 2 y 30 caracteres').isLength({ min: 2, max: 30 }),
   sanitize('lastname').trim(),
   sanitize('lastname').escape(),
   check('lastname', 'El apellido es requerido').exists(),
   check('lastname', 'El apellido debe entre 2 y 50 caracteres').isLength({ min: 2, max: 50 }),
   sanitize('username').trim(),
   sanitize('username').escape(),
   check('username', 'El usuario es requerido').exists(),
   check('username', 'El usuario debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
   sanitize('password').trim(),
   sanitize('password').escape(),
   check('password', 'La contraseña es requerida').exists(),
   check('password', 'La contraseña debe entre 6 y 30 caracteres').isLength({ min: 6, max: 30 }),
   check('password', 'La contraseña no puede tener caracteres especiales (solo letras y números)').isAlphanumeric(),
   sanitize('email').trim(),
   sanitize('email').escape(),
   check('email', 'El email es requerido').exists(),
   check('email', 'No es un formato de email válido').isEmail(),
   check('role').optional()
], checkErrors, usersController.signUp);

router.post('/signIn', [
   sanitize('username').trim(),
   sanitize('username').escape(),
   check('username', 'El usuario es requerido').exists(),
   sanitize('password').trim(),
   sanitize('password').escape(),
   check('password', 'La contraseña es requerida').exists(),
], checkErrors, usersController.signIn);

router.get('/checkUsername', [
   query('username', 'El Nombre de Usuario es requerido').exists(),
   query('username', 'El usuario debe entre 3 y 50 caracteres').isLength({ min: 3, max: 50 }),
], checkErrors, usersController.checkUsername);

router.get('/checkEmail', [
   query('email', 'El email es requerido').exists(),
   query('email', 'No es un formato de email válido').isEmail(),
], checkErrors, usersController.checkEmail);


module.exports = router;