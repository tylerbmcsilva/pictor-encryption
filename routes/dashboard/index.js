const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.use(require('./user'));