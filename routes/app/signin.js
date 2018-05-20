const User  = require('../../models/user');
const { Router }    = require('express');
const passport     = require('passport');
const bcrypt = require('bcrypt');

const router = new Router();
module.exports = router;

router.post('/signin', async function(req, res) {
  const { email, password } = req.body;

  const result = await User.findPass({email, password});
  //console.log(result);
  try {
    if(result.length>0){
      const hash = result[0].password;
      //console.log(hash);
      // check that passwords match
      const cRes = await bcrypt.compare(password, hash).then(async function(res){
        return res;
      });
      try {
        // if they match
        if(cRes){
          // log user into passport
          req.login(result[0].id, function(err){ if(err) throw err;});
        }
      }catch (error) {
        console.error(error);
      }
    }
    res.json([]);
  } catch (error) {
    console.error(error);
  }

});

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
