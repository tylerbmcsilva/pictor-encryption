const { authenticateUser }  = require('../../../models/authentication');
const Logger                = require('../../../models/logger');
const Post                  = require('../../../models/post');
const { Router }            = require('express');


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


router.get('/post/:id/edit', async function(req, res) {
  const { id }  =  req.params;
  const post    = await Post.getOne({ id });
  const user_id = req.session.passport.user;

  if(post.user_id === user_id)
    res.render('app/new_post', { user_id, post });
  else
    res.redirect('/not-found');
})
