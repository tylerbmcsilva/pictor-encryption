const winston  = require('winston');


const Logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'pictor.log' })
    ]
  }
);


module.exports = Logger;
