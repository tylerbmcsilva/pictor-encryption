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
