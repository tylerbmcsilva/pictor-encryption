const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/feed', function(req, res) {
  res.json([
    {
    id: 1,
    user_id: 1,
    title: 'This is a text post',
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: '2018-05-13 19:36:32',
    url: '#',
    post_type: 'text',
    encrypted: 0
    },
    {
    id: 12,
    user_id: 2,
    title: 'This is another text post',
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
    date: '2018-05-11 19:36:32',
    url: '#',
    post_type: 'text',
    encrypted: 1
    },
  ]);
})


router.get('/feed/:id', function(req, res) {
  res.json([{
    id: 1,
    name:     'Harry Potter',
    location: {
      city:   'New York City',
      state:  'New York'
    }
  }]);
})
