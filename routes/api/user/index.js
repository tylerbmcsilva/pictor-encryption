const Encryption  = require('../../../models/encryption');
const Logger      = require('../../../models/logger');
const { Router }  = require('express');
const User        = require('../../../models/user');
const Post        = require('../../../models/post');
const Friend      = require('../../../models/friend');
const passport    = require('passport');
const bcrypt      = require('bcrypt');


const router      = new Router();
module.exports    = router;


router.get('/profile', async function(req, res) {
  try {
    const id      = req.session.passport.user
    const user    = await User.getOne({ id: id });
    const posts   = await Post.getAllUserPosts({ id: id });
    const friends = await Friend.getAllFriendsAndRequests({ id: id });

    if(!user)
      res.status(404).json({ error: 'User not found' });
    else {
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
        encrypted: JSON.parse(user.json_block),
        posts,
        friends
      });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }

});


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
