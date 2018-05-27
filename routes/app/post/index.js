const { Router }    = require('express');
const { authenticateUser }  = require('../../../models/authentication');


const router    = new Router();
module.exports  = router;


router.use('/post', authenticateUser());


router.get('/post/new', function(req, res) {
  try {
    const user_id = req.session.passport.user;

    res.render('app/new_post', {
      user_id
    });
  } catch (error) {
    res.redirect('/feed');
  }
});


router.get('/post/:id', function(req, res) {
  res.render('app/post');
});
