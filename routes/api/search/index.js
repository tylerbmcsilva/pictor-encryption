const { Router }  = require('express');
const Search       = require('../../../models/search');
const metaphone   = require('metaphone');

const router      = new Router();
module.exports    = router;

router.get('/updateSounds', async function(req, res) {
  Search.updateSounds();
  res.status(200);
});

router.get('/search/:name', async function(req, res) {
  var sounds_like = metaphone(req.params.name);
  try {
    var searchResults = await Search.search(req.user, sounds_like);
    if(searchResults.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.status(401).json("Unknown Error User Not Found");
    } else {
      // ENCRYPTION HERE
      res.json(searchResults);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});
