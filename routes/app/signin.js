const Logger        = require('../../models/logger');
const User        = require('../../models/user');
const { Router }  = require('express');
const passport    = require('passport');
const bcrypt      = require('bcrypt');

const router = new Router();
module.exports = router;

router.post('/signin', async function(req, res) {
  const { email, password } = req.body;

  try {
    const result = await User.findPass({email, password});
    if( result.length === 0 ) throw new Error('User does not exist.');
    const user = result[0].id;
    const hash = result[0].password;

    const compareResult = await bcrypt.compare(password, hash);
    if(compareResult){
      Logger.debug(user);
      req.login(user, function(err){ if(err) throw err; });
      res.json({
        message: 'success'
      });
    } else {
      throw new Error('Password is incorrect.'); 
    }
  } catch (error) {
    Logger.error(error);
    res.json({
      message: 'failure'
    });
  }

});

router.post('/user/update', function(req, res) {
  // update DB with data
  Logger.debug(req.body);
})

passport.serializeUser(function(user_id, done){
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done){
  done(null, user_id);
});
