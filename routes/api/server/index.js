const { KEYS, getServerPublicKey }  = require('../../../models/encryption');
const { Router }                    = require('express');


const router    = new Router();
module.exports  = router;


router.get('/server/public-key', async function(req, res) {
  try {
    const response = await getServerPublicKey();

    res.json({
      publicKey: response.public_key
    });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});


router.post('/server/create-store-keys', async function(req, res) {
  try {
    const { publicKey, privateKey } = Encryption.generateKeyPair(2048, 65537);

    const response = await Encryption.storeServerKeys({ publicKey, privateKey });

    res.json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});
