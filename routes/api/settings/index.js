const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');
const User        = require('../../../models/user');
const Friend      = require('../../../models/friend');


const router    = new Router();
module.exports  = router;


router.get('/settings', async function(req, res) {
  const id      = req.session.passport.user;
  const user    = await User.getOne({ id: id });
  const blocked = await Friend.getBlockedUsers({ id: id });
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
    blocked
  });
})


router.put('/settings', async function(req, res) {
  let updates;
  const { first_name, last_name, location, json_block } = req.body;
  updates = {
    first_name: first_name,
    last_name: last_name,
    location: location,
    json_block: JSON.stringify(json_block)
  };

  // console.log(updates);
  const response = await User.update(req.session.passport.user, updates);
  res.json(response);
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
