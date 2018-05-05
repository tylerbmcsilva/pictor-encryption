const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/user', function(req, res) {
  // const users  = await DATABASE CALL
  // res.render('user_all', { users });
  res.render('app/user_all');
})


router.get('/user/:id', function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  res.render('app/user')
})
