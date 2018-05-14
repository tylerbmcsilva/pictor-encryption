const NodeRSA = require('node-rsa');
const server  = require('./server');


const KEYS = generateKeyPair(2048, 65537);


function generateKeyPair(bits, exponent) {
  let key = new NodeRSA({}, 'pkcs8', {
    encryptionScheme: 'pkcs1'
  });

  key.generateKeyPair(bits, exponent);

  let publicKey   = key.exportKey('public');
  let privateKey  = key.exportKey('private');

  return {
    publicKey,
    privateKey
  }
}


async function encryptUsingPublicKey({ key, data }) {
  const KEY = new NodeRSA();

  KEY.importKey(key, 'pkcs8-public-pem');

  const encrypted = await KEY.encrypt(data);

  return encrypted.toString('utf8');
}


module.exports = {
  KEYS,
  encryptUsingPublicKey,
  generateKeyPair,
  ...server
}
