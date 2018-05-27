const { authenticateUser }  = require('../../../models/authentication');
const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.use('/profile', authenticateUser());


router.get('/profile', function(req, res) {
  res.render('app/user');
});
