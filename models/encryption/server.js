const DB      = require('../database');
const Logger  = require('../logger');


async function getServerPublicKey() {
  try {
    const [ publicKey ] = await DB.query("SELECT `public_key` FROM `server` WHERE id=1");
    return publicKey;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


async function storeServerKeys({ publicKey, privateKey }) {
  try {
    const response = await DB.query(`INSERT INTO \`server\` (\`public_key\`, \`private_key\`) VALUES (${publicKey},${privateKey})`);
    return response;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}


module.exports = {
  getServerPublicKey,
  storeServerKeys
}
