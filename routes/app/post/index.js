const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/post/:id', function(req, res) {
  res.render('app/post');
});
