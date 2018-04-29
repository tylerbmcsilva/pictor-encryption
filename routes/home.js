const { database }  = require('../models');
const { Router }    = require('express');


const router = new Router();
module.exports = router;


/*
  Main route
*/
router.get('/', async function(req, res) {
  try {
    res.render('index');
  } catch (error) {
    console.error(error);
  }
});
