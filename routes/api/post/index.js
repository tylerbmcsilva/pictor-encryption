const Encryption  = require('../../../models/encryption');
const Logger      = require('../../../models/logger');
const { Router }  = require('express');
const Post        = require('../../../models/post');


const router    = new Router();
module.exports  = router;


router.post('/post/new', async function(req, res) {
  const { user_id, title, body, date, url, post_type } = req.body;
  const response = await Post.create({ user_id, title, body, date, url, post_type });
  res.json({
    id: response.insertId
  });
});


router.get('/post/:post_id', async function(req, res) {
  const { post_id } = req.params;
  const { user }    = req;
  try {

    const post  = await Post.getOne({ id: post_id });
    if(post === undefined)
      res.status(404).json({});
    else {
      res.json({
        ...post,
        editable: user === post.user_id ? true : false
      });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});


router.put('/post/:post_id', async function(req,res) {
  try {
    const { user }    = req;
    const { post_id } = req.params;
    const updates     = req.body

    const post  = await Post.getOne({ id: post_id });

    if(post && post.user_id === user) {
      const updatedPost = await Post.update({ id: post_id, updates });
      res.json({ message: 'Success' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});


router.delete('/post/:post_id', async function(req,res) {
  try {
    const { user }    = req;
    const { post_id } = req.params;

    const post  = await Post.getOne({ id: post_id });

    if(post && post.user_id === user) {
      const deletedPost = await Post.remove({ id: post_id });

      res.json({ message: 'Success' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});
