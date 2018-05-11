const { getConnection } = require('../pool');
const Promise           = require('bluebird');


async function getServerPublicKey() {
  try {
    // const connection    = await promisify(getConnection)();
    // console.log(connection);
    // const [ publicKey ] = await connection.query("SELECT `public_key` FROM `server` WHERE id=1");

    Promise.using(getConnection(), function(connection) {
        return connection.query('SELECT `public_key` FROM `server` WHERE id=1').then((rows) => {
          return rows[0];
        }).catch(function(error) {
          console.log(error);
        });
    })

    return publicKey;
  } catch (error) {
    throw error;
  }
}


async function storeServerKeys({ publicKey, privateKey }) {
  try {
    const connection  = await promisify(getConnection)();
    const response    = await connection.query(`INSERT INTO \`server\` (\`public_key\`, \`private_key\`) VALUES (${publicKey},${privateKey})`);

    return response;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getServerPublicKey,
  storeServerKeys
}
