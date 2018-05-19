const { findOne }  = require('../../models/user');
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


router.post('/signin', async function(req, res) {
  try {
    let user = req.body['user'];
    // Lookup user in DB
    const data = await findOne(user);

  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
});


router.post('/signin/verify', function(req, res) {
  let response = req.body['response'];
  // 1. decrypt response with server private key
  // 2, verify response matches secret
  console.log(response);
  res.status(202).send("USER VERIFIED");
});
