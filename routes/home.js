const { Router }    = require('express');


const router = new Router();
module.exports = router;


/*
  Main route
*/
router.get('/', function(req, res) {
  res.render('home_page', {
    layout: 'blank'
  });
});
