const Logger  = require('./logger');


function authenticateUser() {
  return (req, res, next) => {
    Logger.log(`
      req.session.passport.user: ${JSON.
        stringify(req.session.passport)}`);

    if (req.isAuthenticated()){
      return next();
    } else {
      const err = new Error();
      err.name = 'UnauthorizedError';
      return next(err);
    }
  }
}


module.exports = {
  authenticateUser
}
