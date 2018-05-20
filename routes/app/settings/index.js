const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/settings', function(req, res) {
  res.render('app/settings');
})
