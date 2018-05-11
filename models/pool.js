const mysql = require('promise-mysql');


const POOL = mysql.createPool({
  host:             process.env.DBHOST,
  user:             process.env.DBUSER,
  password:         process.env.DBPASSWORD,
  database:         process.env.DBNAME,
  ssl:              'Amazon RDS',
  connectionLimit:  10,
  acquireTimeout:   10000,
  debug:            true
});


async function getConnection() {
  return POOL.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}


module.exports = {
  getConnection
};
