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


async function update({ id, updates }) {
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
    const post = await DB.query(`DELETE FROM \`post\` WHERE id=${id}`);
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getOne({ id }) {
  try {
    const [ post ] = await DB.query(`SELECT post.*, user.first_name, user.last_name FROM \`post\`
        INNER JOIN \`user\` ON post.user_id = user.id
        WHERE post.id=${id}`
      );
    return post;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getAllUserPosts({ id }) {
  try {
    let queryString = `SELECT post.*, user.first_name, user.last_name FROM \`post\` INNER JOIN \`user\` ON post.user_id = user.id WHERE user.id = ${id} ORDER BY \`date\` DESC`;
    const posts = await DB.query(queryString);
    return posts;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function getAllFriendPosts({ id }) {
  try {
    let queryString = `SELECT DISTINCT p.*, u.first_name, u.last_name
                  FROM (SELECT user.id, user.first_name, user.last_name from \`user\`
                        INNER JOIN \`request\` ON (user.id = request.sender_id OR user.id = request.receiver_id)
                        WHERE request.req_accepted = 1 AND request.blocked = 0 AND (request.sender_id = ${id} OR request.receiver_id = ${id}) AND user.id != ${id}) as u
                        INNER JOIN post as p ON p.user_id = u.id ORDER BY \`date\` DESC`;
    const posts = await DB.query(queryString);
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
  getOne,
  getAllUserPosts,
  getAllFriendPosts,
}
