const router = require('express').Router();
const { header, validationResult } = require('express-validator/check');

const auth = require('../middlewares/auth.middleware');
const fileUploadService = require('../services/fileUpload.service');

function checkErrors(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.arrary() });
   }

   next();
}

router.get('/user', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAuth, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de user', user: req.body.user });
});

router.get('/admin', [
   header('Authorization', 'Se debe proveer un Token').not().isEmpty()
], checkErrors, auth.isAdmin, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de admin' });
});

router.post('/upload', (req, res) => {
   // console.log(req.files.image);
   const file = req.files.image;
   if (!fileUploadService.isValidExtension(file.name)) {
      return res.status(400).json({ msg: 'No es una extension válida', filename: file.name });
   }

   const renamedFile = fileUploadService.renameFile(file.name, req.body.username);

   file.mv(`./uploads/users/${renamedFile}`, err => {
      if (err) console.log(err);
      res.status(200).json({ msg: 'Archivo subido', file: renamedFile });
   });

});

module.exports = router;