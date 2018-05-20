const { Router }  = require('express');

const User        = require('../../../models/user');
const router    = new Router();
module.exports  = router;


router.get('/feed', User.authUser(), function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  //console.log(req.user);
  //console.log(req.isAuthenticated());
  res.render('app/feed')
})


router.get('/feed/:id', function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  res.render('app/feed')
})
