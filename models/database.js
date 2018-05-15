const mysql = require('mysql');
const util  = require('util');


const POOL = mysql.createPool({
  host:             process.env.DBHOST,
  user:             process.env.DBUSER,
  password:         process.env.DBPASSWORD,
  database:         process.env.DBNAME,
  ssl:              'Amazon RDS',
  acquireTimeout:   60000,
  debug:            false
});


POOL.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST')
      console.error('Database connection was closed.');

    if (err.code === 'ER_CON_COUNT_ERROR')
      console.error('Database has too many connections.');

    if (err.code === 'ECONNREFUSED')
      console.error('Database connection was refused.');

    if (err.code === 'ETIMEDOUT')
      console.error('Database timed out...');

    if (connection)
      connection.release();

    return;
  }
  console.log('Database Connected!');
});


POOL.query = util.promisify(POOL.query);


module.exports = POOL;