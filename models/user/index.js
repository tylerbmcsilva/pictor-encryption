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
    const sounds_like = metaphone(updates.first_name+" "+updates.last_name);
    updates.sounds_like = sounds_like;
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


async function getOne({ id }) {
  try {
    const [ user ] = await DB.query(`SELECT * FROM \`user\` WHERE user.id=${id}`);
    return user;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getAll() {
  try {
    const users = await DB.query('SELECT * FROM `user`');
    return users;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findPass( { email, password }) {
  try {
    const results = await DB.query('SELECT `id`, `password` FROM `user` WHERE ?', {email});
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
  getAll,
  getOne,
  findPass
}
