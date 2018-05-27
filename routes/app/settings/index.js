const { authenticateUser }  = require('../../../models/authentication');
const { Router }            = require('express');


const router    = new Router();
module.exports  = router;


router.use('/settings', authenticateUser());


router.get('/settings', function(req, res) {
  res.render('app/settings');
})
