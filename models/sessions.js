const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const option = {
  host:             process.env.DBHOST,
  port:             3306,
  user:             process.env.DBUSER,
  password:         process.env.DBPASSWORD,
  database:         proccess.env.DPNAME,
  ssl:              'Amazon RDS',
};

const sessionStore = new MySQLStore(option);

module.exports = sessionStore;
