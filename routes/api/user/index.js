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
  const users = await User.findAll();
  res.json(users);
});


router.get('/friend/:id', async function(req, res) {
  const user  = await User.findOne({ id: req.params.id });
  if(user === undefined)
    res.send('');
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
  const { first_name, last_name, email, location, public_key} = req.body;

  // Get password for hashing
  var password = req.body.password;

  const user_id = await bcrypt.hash(password, 12).then(async function(hash){
    password = hash;
    // Store user in database
    const result = await User.create({ first_name, last_name, email, password, location, public_key });
    return result.insertId;
  });

  try {
    req.login(user_id, function(err){ if(err) throw err;});
    //console.log(req.user);
    //console.log(req.isAuthenticated());
  }
  catch (err){
    throw err;
  }
  //res.redirect('/feed');
  res.json([]);
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
