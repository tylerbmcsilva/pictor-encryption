const Logger      = require('../../models/logger');
const { Router }  = require('express');


const router = new Router();
module.exports = router;


// Set Server Public Key
// router.use(function(req, res, next) {
//   let s = KEYS.publicKey.replace(/(-{5}.+-{5})|(\n+)/gm, '');
//   res.set('XSPK', s);
//   next();
// });


router.get('/register', async function(req, res) {
  try {
    res.render('register', {
      layout: 'blank'
    });
  } catch (error) {
    Logger.error(error);
    res.status(500).send();
  }
});
