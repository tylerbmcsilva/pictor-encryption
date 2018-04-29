const mysql         = require('mysql');
const POOL          = require('./pool');
const { promisify } = require('bluebird');



/*
  Establish database connection
*/
async function establishConnection(){
  let connection;
  try {
    console.log('POOL:', POOL);

    connection = await promisify(POOL.getConnection)();
    console.log(connection);

    return connection;
  } catch (error) {
    connection.release();
    console.error(error);
  }
}

module.exports = {
  establishConnection
}
