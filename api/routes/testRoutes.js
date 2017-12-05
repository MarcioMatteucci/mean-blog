const router = require('express').Router();

const auth = require('../middlewares/authMiddleware');

router.get('/user', [], auth.isAuth, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de user' });
});

router.get('/admin', [], auth.isAdmin, (req, res) => {
   res.status(200).json({ success: true, msg: 'Accediste a una ruta con rol de admin' });
});

module.exports = router;