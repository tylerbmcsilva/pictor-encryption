const NodeRSA = require('node-rsa');
const server  = require('./server');


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
  generateKeyPair,
  ...server
}
