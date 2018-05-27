const { authenticateUser }  = require('../../models/authentication');
const { Router }            = require('express');


const router    = new Router();
module.exports  = router;


router.use('/api/*', authenticateUser());


router.use(require('./feed'));
router.use(require('./server'));
router.use(require('./user'));
router.use(require('./post'));
router.use(require('./settings'));
router.use(require('./search'));
router.use(require('./friends'));
