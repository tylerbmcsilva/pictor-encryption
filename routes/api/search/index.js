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
  const sounds_like = metaphone(req.params.name);
  //console.log(sounds_like);
  const friendResults = await Search.searchFriends(req.user, sounds_like);
  const notFriendResults = await Search.searchNotFriends(req.user, sounds_like);
  friendResults.concat(notFriendResults);
  console.log(friendResults);
  res.json(friendResults);
});
