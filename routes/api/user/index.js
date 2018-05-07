const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/api/user/:id', function(req, res) {
  res.json({
    id: 1,
    name:     'Hairy Jeff',
    location: {
      city:   'New York City',
      state:  'New York'
    }
  });
})
