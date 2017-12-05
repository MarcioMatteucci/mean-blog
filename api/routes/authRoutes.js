const router = require('express').Router();

const usersController = require('../controllers/usersController');
const auth = require('../middlewares/authMiddleware');

router.post('/signUp', [], usersController.signUp);

router.post('/signIn', [], usersController.signIn);

module.exports = router;