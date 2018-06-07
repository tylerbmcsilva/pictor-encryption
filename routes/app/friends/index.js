const { Router }  = require('express');
const { authenticateUser }  = require('../../../models/authentication');


const router    = new Router();
module.exports  = router;


router.use('/friends', authenticateUser());
router.use('/friend', authenticateUser());


router.get('/friends*', function(req, res) {
  res.render('app/user_list');
});


router.get('/friend/:id', function(req, res) {
  if (req.params.id == req.session.passport.user) {
    res.redirect('/profile')
  } else {
    res.render('app/user');
  }
});


router.get('/friends/*', function(req, res) {
  res.render('app/user_list');
});
