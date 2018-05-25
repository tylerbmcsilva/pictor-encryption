const DB        = require('../database');
const Logger    = require('../logger');
const passport  = require('passport');
const metaphone = require('metaphone')

async function create({ first_name, last_name, email, password, location, public_key }) {
  try {
    // Hash password w/ bcrypt
    const sounds_like = metaphone(first_name+" "+last_name);
    const user = await DB.query('INSERT INTO `user` SET ?', {
        first_name,
        last_name,
        email,
        password,
        location,
        public_key,
        sounds_like
      });
      return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function update(id, updates) {
  try {
    const user = await DB.query('UPDATE `user` SET ? WHERE ?', [updates, { id }]);
    return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function remove({ id }) {
  try {
    const user = await DB.query('DELETE FROM `user` WHERE ?', { id });
    return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findOne({ id }) {
  try {
    const [ user ] = await DB.query('SELECT * FROM `user` WHERE ?', { id });
    return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findAll() {
  try {
    const users = await DB.query('SELECT * FROM `user`');
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function findOneFriend(id, friendId) {
  try {
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      'WHERE u.id=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    const user = await DB.query(qString, [friendId, id, id]);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function findFriends( id ) {
  try {
    var qString = 'SELECT * FROM (SELECT * FROM `user` u '+
      'WHERE u.id!=?) as notU '+
      'WHERE notU.id IN '+
      '(SELECT r.receiver_id as `id` FROM `request` r '+
      'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
      'UNION SELECT r.sender_id FROM `request` r '+
      'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
    const users = await DB.query(qString, [id, id, id]);
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findNotFriends() {
  var qString = 'SELECT * FROM (SELECT u.first_name, u.last_name, u.id FROM `user` u '+
    'WHERE u.id!=?) as notU '+
    'WHERE notU.id NOT IN '+
    '(SELECT r.receiver_id as `id` FROM `request` r '+
    'WHERE r.sender_id=? AND r.req_accepted=1 AND r.blocked=0 '+
    'UNION SELECT r.sender_id FROM `request` r '+
    'WHERE r.receiver_id=? AND r.req_accepted=1 AND r.blocked=0);';
  try {
    const users = await DB.query(qString, [id, id, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function authUser() {
  return (req, res, next) => {
    Logger.log(`
      req.session.passport.user: ${JSON.
        stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();

    res.redirect('/');
  }

}

async function findPass( { email, password }) {
  try {
    const results = await DB.query('SELECT `id`, `password` FROM `user` WHERE ?', {email});
    console.log(results);
    return results;
  }  catch (error) {
    Logger.error(error);
    throw error;
  }
}

async function addFriend( { receiver_id, sender_id }) {
  try {
    const results = await DB.query('INSERT INTO `request` SET ?',
      {receiver_id, sender_id});
    return results;
  }  catch (error) {
    Logger.error(error);
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
  findPass,
  findFriends,
  findNotFriends,
  findOneFriend,
  addFriend
}
