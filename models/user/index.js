const DB = require('../database');


async function create({ first_name, last_name, email, location, public_key }) {
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


module.exports = {
  create,
  update,
  remove,
  findAll,
  findOne,
}
