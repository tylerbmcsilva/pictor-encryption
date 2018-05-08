const { Router }    = require('express');
const POOL          = require('../models/pool');
const router = new Router();
module.exports = router;



/*
  Main route
*/

router.get('/', async function(req, res) {
  try {
    res.render('home_page', {
      layout: 'blank'
    });
  } catch (error) {
    console.error(error);
  }
});
