const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');
const passport    = require('passport');
const bcrypt = require('bcrypt');

const router      = new Router();
module.exports    = router;


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
  const users = await User.findFriends(req.user);
  res.json(users);
});


router.get('/friend/:id', async function(req, res) {
  //validate profile page accessed a friend
  const user  = await User.findOneFriend(req.user, req.params.id);
  if(user.length === 0) res.status(401); 
  else {
    console.log(user);
    // const encrypted = await Encryption.encryptUsingPublicKey({ key: user.public_key, data: user });
    // console.log(encrypted);
    res.json({
      id:     user.id,
      basic:  {
        name:   {
          first:  user.first_name,
          last:   user.last_name
        },
        email:    user.email,
        location: {
          city:   user.location.split(',')[0],
          state:  user.location.split(',')[1]
        }
      },
      encrypted: user.json_block
    });
  }
  // res.json({
  //   id: 1,
  //   basic: {
  //     name: {
  //       first:  'Dominic',
  //       last:   'Mathis'
  //     },
  //     email:    'dmathis@gmail.com',
  //     location: {
  //       city:   'New York City',
  //       state:  'New York'
  //     }
  //   },
  //   encrypted: {
  //     phone:    '415-867-5309',
  //     gender:   'Male',
  //     birthdate: 'Jul 02, 1985',
  //     language: 'English',
  //     school: 'Stanford',
  //     work:   'Myspace'
  //   }
  // });
})


router.post('/user/new', async function(req, res) {
  const { first_name, last_name, email, location, public_key, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 12);
    const { insertId } = await User.create({
      first_name,
      last_name,
      email,
      password: encryptedPassword,
      location,
      public_key
    });
    console.log(insertId);
    req.login(insertId, function(err){ if(err) throw err; });
    res.json({
      redirectUrl: '/feed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})


router.post('/user/update', function(req, res) {
  // update DB with data
  console.log(req.body);
})

passport.serializeUser(function(user_id, done){
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done){
  done(null, user_id);
});
