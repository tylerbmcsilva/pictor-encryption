const { Router }    = require('express');
const { authUser }  = require('../../models/user');


const router    = new Router();
module.exports  = router;


router.use('/api/*', authUser());


router.use(require('./feed'));
router.use(require('./server'));
router.use(require('./user'));
router.use(require('./post'));
router.use(require('./settings'));
