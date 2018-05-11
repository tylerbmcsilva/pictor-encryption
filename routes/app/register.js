const { Router }    = require('express');


const router = new Router();
module.exports = router;


router.get('/register', async function(req, res) {
  try {
    res.render('register', {
      layout: 'blank'
    });
  } catch (error) {
    console.error(error);
  }
});
