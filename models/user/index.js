const DB = require('../database');
const passport = require('passport');

async function create({ first_name, last_name, email, password, location, public_key }) {
  try {
    // Hash password w/ bcrypt
    const user = await DB.query('INSERT INTO `user` SET ?', {
      first_name,
      last_name,
      email,
      password,
      location,
      public_key,
      });
      return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function update(id, updates) {
  try {
    const user = await DB.query('UPDATE `user` SET ? WHERE ?', [updates, { id }]);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function remove({ id }) {
  try {
    const user = await DB.query('DELETE FROM `user` WHERE ?', { id });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function findOne({ id }) {
  try {
    const [ user ] = await DB.query('SELECT * FROM `user` WHERE ?', { id });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function findAll() {
  try {
    const users = await DB.query('SELECT * FROM `user`');
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function authUser() {
  return (req, res, next) => {
    console.log(`
      req.session.passport.user: ${JSON.
        stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();

    res.redirect('/');
  }

}

async function findPass( { email, password }) {
  try {
    const results = await DB.query('SELECT `id`, `password` FROM `user` WHERE ?', {email});
    return results;
  }  catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  create,
  update,
  remove,
  findAll,
  findOne,
  authUser,
  findPass
}
