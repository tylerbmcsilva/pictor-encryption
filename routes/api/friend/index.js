const { Router }  = require('express');
const User       = require('../../../models/user');

const router      = new Router();
module.exports    = router;


router.get('/addFriend/:id', async function(req, res) {
  var result = await User.addFriend({receiver_id: req.params.id, sender_id: req.user});
  res.json(result);
});
