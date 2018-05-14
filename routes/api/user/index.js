const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.get('/user', async function(req, res) {
  const users = await User.getAllUsers();
  res.json(users);
})


router.get('/user/:id', async function(req, res) {
  const user = await User.getUserById({ id: req.params.id });
  const encrypted = await Encryption.encryptUsingPublicKey({ key: user.public_key, data: user });
  res.json(encrypted);
})


router.post('/user/new', async function(req, res) {
  const { first_name, last_name, email, location, public_key } = req.body;
  const response = await User.createNewUser({ first_name, last_name, email, location, public_key });
  res.json(response);
})
