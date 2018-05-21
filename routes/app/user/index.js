const { Router }  = require('express');
const { authUser }  = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.use('/profile', authUser());
router.use('/friends', authUser());
router.use('/friend', authUser());



router.get('/profile', function(req, res) {
  res.render('app/user');
});


router.get('/friends', function(req, res) {
  res.render('app/user_list');
});


router.get('/friend/:id', function(req, res) {
  res.render('app/user');
});
