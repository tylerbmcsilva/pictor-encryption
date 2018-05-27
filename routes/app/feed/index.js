const { Router }    = require('express');
const { authenticateUser }  = require('../../../models/authentication');


const router    = new Router();
module.exports  = router;


router.use('/feed', authenticateUser());


router.get('/feed', function(req, res) {
  res.render('app/feed');
});
