const { database }  = require('../config');
const mysql         = require('mysql');


const POOL = mysql.createPool({
  host:           database.dbhost,
  user:           database.dbuser,
  password:       database.dbpassword,
  database:       database.dbname,
  ssl :           "Amazon RDS",
  acquireTimeout: 30000,
  debug:          true
});


module.exports = POOL;
