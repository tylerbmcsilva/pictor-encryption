const { Router }    = require('express');
const { authUser }  = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.use('/feed', authUser());


router.get('/feed', function(req, res) {
  res.render('app/feed');
});
