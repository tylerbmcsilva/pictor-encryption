const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.use(require('./register'));
router.use(require('./signin'));
router.use(require('./user'));
router.use(require('./feed'));
