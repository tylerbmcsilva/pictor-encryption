const DB      = require('../database');
const Logger  = require('../logger');


async function create({ user_id, title, body, date, url, post_type }) {
  try {
    const post = await DB.query('INSERT INTO `post` SET ?', {
      user_id,
      title,
      body,
      date,
      url,
      post_type
    });
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function update(id, updates) {
  try {
    const post = await DB.query('UPDATE `post` SET ? WHERE ?', [updates, { id }]);
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function remove({ id }) {
  try {
    const post = await DB.query('DELETE FROM `post` WHERE ?', { id });
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findOne({ id }) {
  try {
    const [ post ] = await DB.query('SELECT * FROM `post` WHERE ?', { id });
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findAll() {
  try {
    const posts = await DB.query('SELECT * FROM `post` ORDER BY `date` DESC');
    return posts;
  } catch (error) {
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
}