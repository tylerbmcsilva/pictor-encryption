const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/profile', function(req, res) {
  res.render('app/user');
});


router.get('/friends', function(req, res) {
  res.render('app/user_list');
});


router.get('/friend/:id', function(req, res) {
  res.render('app/user');
});
