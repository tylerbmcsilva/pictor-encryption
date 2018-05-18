const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.get('/user', async function(req, res) {
  // const users = await User.findAll();
  res.json([]);
})


router.get('/user/:id', async function(req, res) {
  const user  = await User.findOne({ id: req.params.id });
  // const encrypted = await Encryption.encryptUsingPublicKey({ key: user.public_key, data: user });
  // console.log(encrypted);
  res.json(user);
  // res.json({
  //   id: user.id,
  //   basic: {
  //     name: {
  //       first:  user.first_name,
  //       last:   user.last_name
  //     },
  //     email:    user.email,
  //     location: user.location
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
  const { first_name, last_name, email, location, public_key } = req.body;
  const response = await User.create({ first_name, last_name, email, location, public_key });
  res.json(response);
})


router.post('/user/:id/update', async function(req, res) {
  let updates;
  if (req.body.basic) {
    const { first_name, last_name, email, location } = req.body;
    updates = {
      first_name: first_name,
      last_name: last_name,
      location: location
    };
  } else {
    const { json_block } = req.body;
    updates = {json_block: json_block};
  }

  const response = await User.update(req.params.id, updates);
  res.json(response);
})
