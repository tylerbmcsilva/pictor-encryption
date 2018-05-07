const { Router }    = require('express');


const router = new Router();
module.exports = router;


router.get('/signin', async function(req, res) {
  try {
    res.render('signin', {
      layout: 'blank'
    });
  } catch (error) {
    console.error(error);
  }
});

router.post('/signin', function(req, res) {
  let user = req.body['user'];
  // 1. lookup user in DB
  // 2. generate secret and encrypt with user public key
  console.log(user);
  res.send("SERVER SENDS ENCRYPTED SECRET");
});

router.post('/signin/verify', function(req, res) {
  let response = req.body['response'];
  // 1. decrypt response with server private key
  // 2, verify response matches secret
  console.log(response);
  res.send("USER VERIFIED");
});
