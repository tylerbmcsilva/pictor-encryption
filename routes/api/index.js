const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.use(require('./user'));
router.use(require('./genAndStoreSKP')); 
router.use(require('./getSPK'));
