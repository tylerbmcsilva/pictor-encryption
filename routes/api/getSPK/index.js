const { Router }  = require('express');
const NodeRSA   = require('node-rsa');
const POOL          = require('../../../models/pool');

const router    = new Router();
module.exports  = router;

router.get('/api/getSPK', function(req, res) {

  POOL.query("SELECT `public_key` FROM `server` WHERE id=1", (err, result)=>{
    if (err) throw err;
    else{
        res.send(JSON.stringify(result[0]));
      }
    }
  );
});
