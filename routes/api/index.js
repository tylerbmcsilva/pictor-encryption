const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.use(require('./feed'));
router.use(require('./server'));
router.use(require('./user'));
router.use(require('./settings'));
