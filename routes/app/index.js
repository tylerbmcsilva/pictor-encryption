const { Router }    = require('express');


const router    = new Router();
module.exports  = router;


router.use(require('./register'));
router.use(require('./signin'));
router.use(require('./user'));
router.use(require('./feed'));
router.use(require('./post'));
router.use(require('./settings'));
router.use(require('./search'));
router.use(require('./friends'));


router.get('/not-found', function(req, res) {
  res.render('app/not_found');
});
