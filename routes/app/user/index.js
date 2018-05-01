const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/user/:id', function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  res.render('user')
})
