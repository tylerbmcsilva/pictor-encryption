const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const Post        = require('../../../models/post');


const router    = new Router();
module.exports  = router;


router.get('/post/:id', async function(req, res) {
  try {
    const post  = await Post.findOne({ id: req.params.id });
    if(post === undefined)
      // res.send('');
      res.json( {
        id:         1,
        user_id:    1,
        title:      'test title',
        body:       'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        date:       '2018-05-13 19:36:32',
        url:        'http://google.com',
        encrypted:  0
      });
    else {
      res.json(post);
    }
  } catch (error) {
    console.error(error);
    res.json( {
      id:         1,
      user_id:    1,
      title:      'test title',
      body:       'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      date:       '2018-05-13 19:36:32',
      url:        'http://google.com',
      encrypted:  0
    });
  }
});


router.post('/post/new', async function(req, res) {
  const { user_id, title, body, date, url, post_type } = req.body;
  const response = await Post.create({ user_id, title, body, date, url, post_type });
  res.json({
    id: response.insertId
  });
});
