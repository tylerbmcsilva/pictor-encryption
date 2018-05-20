const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.get('/settings', async function(req, res) {
  // const encrypted = await Encryption.encryptUsingPublicKey({ key: user.public_key, data: user });
  // console.log(encrypted);
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
      phone:    '415-867-5309',
      gender:   'Male',
      birthdate: 'Jul 02, 1985',
      language: 'English',
      school: 'Stanford',
      work:   'Myspace',
      picture:  '/images/profile/blank.png'
    }
  });
})


router.post('/settings/update', async function(req, res) {
  let updates;
  const { first_name, last_name, location, json_block } = req.body;
  updates = {
    first_name: first_name,
    last_name: last_name,
    location: location,
    json_block: json_block
  };

  console.log(updates);
  // const response = await User.update(req.params.id, updates);
  // res.json(response);
})

router.post('/settings/upload', async function(req, res) {
  console.log(req);
  // let imageFile = req.files.file;
  //
  // imageFile.mv(`${__dirname}/public/profile/${req.body.filename}`, function(err) {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  //
  //   res.json({file: `public/profile/${req.body.filename}`});
  // });
  // console.log(req.files);
  // const response = await User.update(req.params.id, updates);
  // res.json(response);
})
