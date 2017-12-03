const router = require('express').Router();
const passport = require('passport');

const UsersController = require('../controllers/usersController');
const passportConfig = require('../config/passport');

router.post('/signUp', UsersController.signUp);

router.post('/signIn', [], passport.authenticate('local', { session: false }), UsersController.signIn);

router.get('/secret', [], passport.authenticate('jwt', { session: false }), UsersController.secret);

module.exports = router;