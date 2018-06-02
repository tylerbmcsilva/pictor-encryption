const { Router }  = require('express');
const Friend      = require('../../../models/friend');
const Post        = require('../../../models/post');
const Logger      = require('../../../models/logger');
const passport    = require('passport');


const router      = new Router();
module.exports    = router;


router.get('/friends/sendRequest/:id', async function(req, res) {
  try {
    const response  = await Friend.sendFriendRequest({receiver_id: req.params.id, sender_id: req.user});
    const results   = await Friend.getAllFriendsAndRequests(req, res);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(results);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friends/delete/:id', async function(req, res) {
  try {
    const response  = await Friend.deleteFriendRequest(req.user, req.params.id);
    const results   = await Friend.getAllFriendsAndRequests(req, res);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(results);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friends/block/:id', async function(req, res) {
  try {
    const response  = await Friend.blockUser(req.user, req.params.id);
    const results   = await Friend.getAllFriendsAndRequests(req, res);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(results);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friends/unblock/:id', async function(req, res) {
  try {
    const response  = await Friend.unblockUser(req.user, req.params.id);
    const results   = await Friend.getAllFriendsAndRequests(req, res);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(results);
    }
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friends/accept/:id', async function(req, res) {
  try {
    const response  = await Friend.acceptFriendRequest(req.user, req.params.id);
    const results   = await Friend.getAllFriendsAndRequests(req, res);
    if(results.length === 0) {
      // ****************************************
      // IF NOTHING, SEND TEST DATA FOR NOW
      // ****************************************
      res.json(nothingFoundUser);
    } else {
      // ENCRYPTION HERE
      res.json(results);
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
    const { user }  = req.session.passport;
    const results   = await Friend.getAllFriendsAndRequests({ id: user});

    res.json(results);
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error: error.message
    })
  }
});


router.get('/friend/:friendId', async function(req, res) {
  try {
    const { friendId }  = req.params;
    const user          = await Friend.getUser({ id: req.user, friendId });
    const posts         = await Post.getAllUserPosts({ id: friendId });
    const friends       = await Friend.getAllFriendsAndRequests({ id: friendId });

    if(!user) {
      res.status(404).send();
    } else {
      // ENCRYPTION HERE
      res.json({
        id:     user.id,
        basic:  {
          name:   {
            first:  user.first_name,
            last:   user.last_name
          },
          email:    user.email,
          location: user.location
        },
        encrypted: JSON.parse(user.json_block),
        posts,
        friends
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
