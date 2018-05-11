const Encryption  = require('../../../models/encryption');
const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/server/public-key', async function(req, res) {
  try {
    console.log('ENDPOINT HIT!');
    const publicKey = await Encryption.getServerPublicKey();
    res.json({
      publicKey
    });
  } catch (error) {
    console.error(error);
    res.send(500);
  }
});


router.post('/server/create-store-keys', async function(req, res) {
  try {
    const { publicKey, privateKey } = Encryption.generateKeyPair();

    const response = await Encryption.storeServerKeys({ publicKey, privateKey });

    res.json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.send(500);
  }
});
