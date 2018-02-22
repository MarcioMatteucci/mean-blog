const router = require('express').Router();
const { check, validationResult, header } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const auth = require('../middlewares/auth.middleware');

const UsersController = require('../controllers/users.controller');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
   }

   next();
}

router.get('/image', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAuth, UsersController.getImageByUser);

module.exports = router;