const { Router } = require('express');


const router = new Router();
module.exports = router;


router.use('/api', require('./api'));
router.use(require('./app'));
router.use(require('./signin'));
router.use(require('./home'));


/*
  Routes for error handling
*/
router.use( (req, res) => {
  res.status(404);
  res.render('404');
});


router.use( (err, req, res, next) => {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
