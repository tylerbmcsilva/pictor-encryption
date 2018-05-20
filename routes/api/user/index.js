const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.get('/profile', async function(req, res) {
  // Code to get information regarding self
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
});


router.get('/friends', async function(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.json([{
      id: 1,
      basic: {
        name: {
          first:  'Dominic',
          last:   'Mathis'
        },
        email:    'dmathis@gmail.com',
        location: 'New York City, New York'
      },
      encrypted: {
        phone:      '415-867-5309',
        gender:     'Male',
        birthdate:  'Jul 02, 1985',
        language:   'English',
        school:     'Stanford',
        work:       'Myspace'
      }
    }]);
  }

});


router.get('/friend/:id', async function(req, res) {
  try {
    const user  = await User.findOne({ id: req.params.id });
    if(user === undefined)
      res.send('');
    else {
      // ENCRYPTION
      res.json({
        id:     user.id,
        basic:  {
          name:   {
            first:  user.first_name,
            last:   user.last_name
          },
          email:    user.email,
          location: user.location
        },
        encrypted: user.json_block
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      id: 1,
      basic: {
        name: {
          first:  'Dominic',
          last:   'Mathis'
        },
        email:    'dmathis@gmail.com',
        location: 'New York City, New York'
      },
      encrypted: {
        phone:      '415-867-5309',
        gender:     'Male',
        birthdate:  'Jul 02, 1985',
        language:   'English',
        school:     'Stanford',
        work:       'Myspace'
      }
    });
  }

})


router.post('/user/new', async function(req, res) {
  const { first_name, last_name, email, location, public_key } = req.body;
  const response = await User.create({ first_name, last_name, email, location, public_key });
  res.json(response);
});


router.post('/user/update', function(req, res) {
  // update DB with data
  console.log(req.body);
})
