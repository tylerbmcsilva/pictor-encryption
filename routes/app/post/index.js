const { Router }    = require('express');
const { authUser }  = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.use('/post', authUser());


router.get('/post/new', function(req, res) {
  // TODO: Load user's id
  res.render('app/new_post', {
    user_id: req.session.passport.user
  });
});


router.get('/post/:id', function(req, res) {
  res.render('app/post');
});
