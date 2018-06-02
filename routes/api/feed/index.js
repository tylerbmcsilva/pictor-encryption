const Logger      = require('../../../models/logger');
const Post        = require('../../../models/post');
const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/feed', async function(req, res) {
  const { user } = req.session.passport;

  try {
    const posts  = await Post.getAllFriendPosts({ id: user });
    res.json(posts);
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});
