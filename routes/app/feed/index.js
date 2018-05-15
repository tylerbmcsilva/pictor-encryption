const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/feed', function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  res.render('app/feed')
})


router.get('/feed/:id', function(req, res) {
  // const user  = await DATABASE CALL
  // res.render('user', { user });
  res.render('app/feed')
})
