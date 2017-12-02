const router = require('express').Router();

router.get('/', (req, res, next) => {
   res.json({ res: 'GET request de user' });
});

router.post('/', (req, res, next) => {
   res.json({ user: req.body.user });
})

module.exports = router;