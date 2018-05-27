const { authenticateUser }  = require('../../../models/authentication');
const { Router }            = require('express');
const User                  = require('../../../models/user');

const router    = new Router();
module.exports  = router;


router.use('/search*', authenticateUser());


router.get('/search*', function(req, res) {
  res.render('app/search_results');
});
