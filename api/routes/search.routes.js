const router = require('express').Router();

const SearchesController = require('../controllers/searches.controller');

router.get('/', SearchesController.searchAll);

module.exports = router;