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
  var friendResults = await Search.searchFriends(req.user, sounds_like);
  for (var i in friendResults){
    friendResults[i].friend_bool = true;
  }
  var notFriendResults = await Search.searchNotFriends(req.user, sounds_like);
  for (var i in notFriendResults){
    notFriendResults[i].friend_bool = false;
  }
  const allResults = friendResults.concat(notFriendResults);
  res.json(allResults);
});
