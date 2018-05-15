const { Router }  = require('express');
const NodeRSA   = require('node-rsa');

const POOL          = require('../../../models/pool');

const router    = new Router();
module.exports  = router;

router.get('/api/genAndStoreSKP', async function(req, res) {
  // generate servers key pair
  var key = new NodeRSA();
  key.generateKeyPair(2048, 65537);
  let pemPubK = await key.exportKey('public');
  let pemPrivK = await key.exportKey('private');
  
  // store in database
  POOL.query("INSERT INTO `server` (`public_key`, `private_key`) VALUES (?,?)",
            [pemPubK, pemPrivK], (err, result)=>{
    if (err) throw err;
    else res.json({message: "Success"});
  });
})
