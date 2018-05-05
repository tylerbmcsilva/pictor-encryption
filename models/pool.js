const mysql         = require('mysql');


const POOL = mysql.createPool({
  host:           process.env.DBHOST,
  user:           process.env.DBUSER,
  password:       process.env.DBPASSWORD,
  database:       process.env.DBNAME,
  ssl:            "Amazon RDS",
  acquireTimeout: 30000,
  debug:          true
});


module.exports = POOL;
