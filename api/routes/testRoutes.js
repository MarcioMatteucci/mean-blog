const router = require('express').Router();
const { header, validationResult } = require('express-validator/check');

const auth = require('../middlewares/authMiddleware');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
   }

   next();
}

router.get('/user', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAuth, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de user' });
});

router.get('/admin', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAdmin, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de admin' });
});

module.exports = router;