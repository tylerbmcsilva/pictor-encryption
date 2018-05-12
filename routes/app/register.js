const { Router }  = require('express');


const router = new Router();
module.exports = router;


// Set Server Public Key
router.use(function(req, res, next) {
  res.set('X-SPK', '12345686543');
  next();
});


router.get('/register', async function(req, res) {
  try {
    res.render('register', {
      layout: 'blank'
    });
  } catch (error) {
    console.error(error);
  }
});
