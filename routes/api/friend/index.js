const { Router }  = require('express');
const Friend       = require('../../../models/friend');
const Logger      = require('../../../models/logger');
const passport    = require('passport');

const router      = new Router();
module.exports    = router;


router.get('/friend/sendRequest/:id', async function(req, res) {
  var result = await Friend.sendFriendRequest({receiver_id: req.params.id, sender_id: req.user});
  res.json(result);
});

router.get('/friend/delete/:id', async function(req, res) {
  try {
    const result = await Friend.deleteFriendRequest(req.user, req.params.id);
    const users  = await Friend.findFriends(req.user);
    if(users.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(users);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friends', async function(req, res) {
  try {
    var friends = await Friend.findFriends(req.user);
    var sentRequests = await Friend.getSentRequests(req.user);
    var blockedUsers = await Friend.getBlockedUsers(req.user);
    var receivedRequests = await Friend.getReceivedRequests(req.user);
    for (var i in friends){
      friends[i].friend_bool = true;
      friends[i].sreq_bool = false;
      friends[i].rreq_bool = false;
      friends[i].blocked_bool = false;
    }
    for (var i in sentRequests){
      sentRequests[i].friend_bool = false;
      sentRequests[i].sreq_bool = true;
      sentRequests[i].rreq_bool = false;
      sentRequests[i].blocked_bool = false;
    }
    for (var i in blockedUsers){
      blockedUsers[i].friend_bool = false;
      blockedUsers[i].sreq_bool = false;
      blockedUsers[i].rreq_bool = false;
      blockedUsers[i].blocked_bool = true;
    }
    for (var i in receivedRequests){
      receivedRequests[i].friend_bool = false;
      receivedRequests[i].sreq_bool = false;
      receivedRequests[i].rreq_bool = true;
      receivedRequests[i].blocked_bool = false;
    }
    var results = friends.concat(sentRequests);
    results = results.concat(blockedUsers);
    results = results.concat(receivedRequests);
    //console.log(results);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    }
    else {
      res.json(results);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friend/:id', async function(req, res) {
  try {
    const user  = await Friend.findOneFriend(req.user, req.params.id);
    if(user.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json({
        id:     user[0].id,
        basic:  {
          name:   {
            first:  user[0].first_name,
            last:   user[0].last_name
          },
          email:    user[0].email,
          location: user[0].location
        },
        encrypted: user[0].json_block
      });
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }

})

const nothingFoundUser = {
  id: null,
  basic: {
    name: {
      first:  'Dominic',
      last:   'Mathis'
    },
    email:    'dmathis@gmail.com',
    location: 'New York City, New York'
  },
  encrypted: {
    phone:      '415-867-5309',
    gender:     'Male',
    birthdate:  'Jul 02, 1985',
    language:   'English',
    school:     'Stanford',
    work:       'Myspace'
  }
}
