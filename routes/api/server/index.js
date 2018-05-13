const { KEYS }  = require('../../../models/encryption');
const { Router }  = require('express');


const router    = new Router();
module.exports  = router;


router.get('/server/public-key', async function(req, res) {
  try {
    // const publicKey = await Encryption.getServerPublicKey();
    const publicKey = KEYS.publicKey.replace(/(-{5}.+-{5})|(\n+)/gm, '');
    console.log(publicKey);
    res.json({
      publicKey
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//
// router.post('/server/create-store-keys', async function(req, res) {
//   try {
//     const { publicKey, privateKey } = Encryption.generateKeyPair(2048, 65537);
//
//     const response = await Encryption.storeServerKeys({ publicKey, privateKey });
//
//     res.json({ message: 'Success' });
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });
