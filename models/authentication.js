const Logger  = require('./logger');


function authenticateUser() {
  return (req, res, next) => {
    Logger.log(`
      req.session.passport.user: ${JSON.
        stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();

    res.redirect('/');
  }
}


module.exports = {
  authenticateUser
}
