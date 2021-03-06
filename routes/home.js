const { Router }    = require('express');


const router = new Router();
module.exports = router;


/*
  Main route
*/
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/feed');
  } else {
    res.render('home_page', {
      layout: 'blank'
    });
  }

});

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');;
})
