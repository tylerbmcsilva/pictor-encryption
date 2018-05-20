const { Router }  = require('express');
const User        = require('../../../models/user');

const router    = new Router();
module.exports  = router;

router.use('/profile*', User.authUser());
router.use('/friend*', User.authUser());

router.get('/profile', function(req, res) {
  res.render('app/user');
});


router.get('/friends', function(req, res) {
  res.render('app/user_list');
});


router.get('/friend/:id', function(req, res) {
  res.render('app/user');
});
