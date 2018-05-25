const Encryption  = require('../../../models/encryption');
const Logger      = require('../../../models/logger');
const { Router }  = require('express');
const User        = require('../../../models/user');
const passport    = require('passport');
const bcrypt = require('bcrypt');

const router      = new Router();
module.exports    = router;


router.get('/profile', async function(req, res) {
  const user  = await User.findOne({ id: req.session.passport.user });
  // ENCRYPTION HERE
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
    encrypted: JSON.parse(user.json_block)
  });
});


router.get('/friends', async function(req, res) {
  try {
    const users = await User.findFriends(req.user);
    if(users.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
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
    else {
      res.json(users);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friend/:id', async function(req, res) {
  try {
    const user  = await User.findOneFriend(req.user, req.params.id);
    if(user.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
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
    } else {
      // ENCRYPTION HERE
      res.json({
        id:     user[0].id,
        basic:  {
          name:   {
            first:  user[0].first_name,
            last:   user[0].last_name
          },
          email:    user[0].email,
          location: user[0].location
        },
        encrypted: user[0].json_block
      });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }

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
    Logger.debug(insertId);
    req.login(insertId, function(err){ if(err) throw err; });
    res.json({
      redirectUrl: '/feed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
});


passport.serializeUser(function(user_id, done){
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done){
  done(null, user_id);
});
