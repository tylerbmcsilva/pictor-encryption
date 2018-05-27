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


async function findOne( id ) {
  try {
    const [ post ] = await DB.query('SELECT post.*, user.first_name, user.last_name FROM `post` INNER JOIN `user` ON post.user_id = user.id WHERE ?',  id );
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findAllUser( user ) {
  try {
    const posts = await DB.query('SELECT post.*, user.first_name, user.last_name FROM `post` INNER JOIN `user` ON post.user_id = user.id WHERE ? ORDER BY `date` DESC', user);
    return posts;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function findAllFriend( user ) {
  try {
    const posts = await DB.query('SELECT DISTINCT p.id, p.user_id, p.title, u.first_name, u.last_name FROM (SELECT user.id, user.first_name, user.last_name from `user` INNER JOIN `request` ON (user.id = request.sender_id OR user.id = request.receiver_id) WHERE request.req_accepted = 1 AND request.blocked = 0 AND (request.sender_id = ? OR request.receiver_id = ?) AND user.id != ?) as u INNER JOIN post as p ON p.user_id = u.id ORDER BY `date` DESC', [user, user, user]);
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
  findAllUser,
  findOne,
  findAllFriend,
}
