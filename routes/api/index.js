const { authenticateUser }  = require('../../models/authentication');
const { Router }            = require('express');


const router    = new Router();
module.exports  = router;

router.use(require('./user'));
router.use('/*', authenticateUser());


router.use(require('./feed'));
router.use(require('./server'));
router.use(require('./post'));
router.use(require('./settings'));
router.use(require('./search'));
router.use(require('./friends'));


router.use(async function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    next(err);
  }
})
