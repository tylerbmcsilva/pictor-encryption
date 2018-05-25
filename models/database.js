const mysql   = require('mysql');
const Logger  = require('./logger');
const util    = require('util');


const POOL = mysql.createPool({
  host:             process.env.DBHOST,
  user:             process.env.DBUSER,
  password:         process.env.DBPASSWORD,
  database:         process.env.DBNAME,
  ssl:              'Amazon RDS',
  acquireTimeout:   15000,
  debug:            false
});


POOL.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST')
      Logger.error('Database connection was closed.');

    if (err.code === 'ER_CON_COUNT_ERROR')
      Logger.error('Database has too many connections.');

    if (err.code === 'ECONNREFUSED')
      Logger.error('Database connection was refused.');

    if (err.code === 'ETIMEDOUT')
      Logger.error('Database timed out...');

    if (connection)
      connection.release();

    return connection;
  }
  Logger.info('Database Connected!');
});


POOL.query          = util.promisify(POOL.query);
POOL.getConnection  = util.promisify(POOL.getConnection);


module.exports = POOL;
