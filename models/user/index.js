const DB = require('../database');


async function createNewUser({ first_name, last_name, email, location, public_key }) {
  try {
    const user = await DB.query('INSERT INTO `user` SET ?', {
        first_name,
        last_name,
        email,
        location,
        public_key
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function getUserById({ id }) {
  try {
    const [ user ] = await DB.query(`SELECT * FROM \`user\` WHERE \`id\` in (${id})`);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function getAllUsers() {
  try {
    const users = await DB.query('SELECT * FROM `user`');
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


module.exports = {
  createNewUser,
  getAllUsers,
  getUserById
}
