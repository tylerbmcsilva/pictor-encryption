const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/user', function(req, res) {
  res.json([{
    id: 1,
    name:     'Harry Potter',
    location: {
      city:   'New York City',
      state:  'New York'
    }
  }]);
})


router.get('/user/:id', function(req, res) {
  res.json({
    id: 1,
    name:     'Harry Potter',
    location: {
      city:   'New York City',
      state:  'New York'
    }
  });
})


router.post('/user/new', function(req, res) {
  console.log(req.body);
})
