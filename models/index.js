const POOL          = require('./pool');
const { promisify } = require('bluebird');


/*
  Establish database connection
*/
async function getConnection(){
  try {
    return await POOL.getConnection();
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  getConnection
}
