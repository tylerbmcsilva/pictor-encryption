const NodeRSA = require('node-rsa');
const server  = require('./server');


const KEYS = generateKeyPair(2048, 65537);


function generateKeyPair(bits, exponent) {
  let key = new NodeRSA();

  key.generateKeyPair(bits, exponent);

  let publicKey   = key.exportKey('public');
  let privateKey  = key.exportKey('private');

  return {
    publicKey,
    privateKey
  }
}


module.exports = {
  KEYS,
  generateKeyPair,
  ...server
}
