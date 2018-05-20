const { Router }  = require('express');
const User        = require('../../../models/user');
const router    = new Router();
module.exports  = router;

router.use('/feed*', User.authUser());
router.get('/feed', function(req, res) {
  res.render('app/feed');
});
