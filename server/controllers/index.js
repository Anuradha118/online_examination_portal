var router = require('express').Router();


router.use('/', require('./users.js'));
router.use('/test', require('./tests.js'));

module.exports = router;