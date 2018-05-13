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
    basic: {
      name: {
        first:  'Dominic',
        last:   'Mathis'
      },
      email:    'dmathis@gmail.com',
      location: {
        city:   'New York City',
        state:  'New York'
      }
    },
    encrypted: {
      phone:    '415-867-5309',
      gender:   'Male',
      birthdate: 'Jul 02, 1985',
      language: 'English',
      school: 'Stanford',
      work:   'Myspace'
    }
  });
})


router.post('/user/new', function(req, res) {
  console.log(req.body);
})


router.post('/user/update', function(req, res) {
  // update DB with data
  console.log(req.body);
})
