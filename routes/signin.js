const { Router }    = require('express');


const router = new Router();
module.exports = router;


router.get('/signin', async function(req, res) {
  res.redirect('/user');
});
