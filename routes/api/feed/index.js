const Post        = require('../../../models/post')
const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/feed', async function(req, res) {
  try {
    const posts  = await Post.findAll();
    if(posts.length === 0) {
      // res.send('')
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json( [{
        id:         1,
        user_id:    1,
        title:      'test title',
        body:       'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        date:       '2018-05-13 19:36:32',
        url:        'http://google.com',
        encrypted:  0
      },
      {
        id:         2,
        user_id:    2,
        title:      'test title2',
        body:       'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        date:       '2018-05-13 19:36:32',
        url:        'http://google.com',
        encrypted:  0
      }]);
    } else {
      res.json(posts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});
