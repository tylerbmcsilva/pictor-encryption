const { Router }  = require('express');
const { authUser }  = require('../../../models/user');


const router    = new Router();
module.exports  = router;


router.use('/friends', authUser());
router.use('/friend', authUser());

router.get('/friends', function(req, res) {
  res.render('app/user_list');
});


router.get('/friend/:id', function(req, res) {
  res.render('app/user');
});

router.get('/friend/delete/*', function(req, res){
  res.render('app/user_list');
})
router.get('/friend/sendRequest/*', function(req, res){
  res.render('app/user_list');
})
