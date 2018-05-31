/*
  Required packages
*/
const bodyParser      = require('body-parser');
const express         = require('express');
const exphbs          = require('express-handlebars');
const router          = require('./routes/index');
const session         = require('express-session');
const passport        = require('passport');
const sessionStore    = require('./models/sessions');
const Logger          = require('./models/logger');
const winston         = require('winston');
const expressWinston  = require('express-winston');

/*
  Set up server
*/
const app = express();

/*
  Set up clean logging
*/
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          colorize: true
        }),
        new winston.transports.File({
          json:     true,
          filename: 'pictor.log'
        })
      ],
      expressFormat:  true,
      meta:           false,
      msg:            'HTTP {{req.method}} {{req.url}}',
      ignoreRoute:    function(req, res) {
        const { url } = req;
        if( url.includes('/js') || url.includes('/cs') || url.includes('/images') ){
          return true;
        } else {
          return false;
        }
      }
    }));

/*
  Set up view engine
*/
app.engine('.hbs',
  exphbs({
    extname:        '.hbs',
    defaultLayout:  'app',
    layoutsDir:     'views/layouts',
    partialsDir:    'views/partials'
  })
);
app.set('view engine', '.hbs');
app.set('port', 3000);

/*
  Set up Cookie Parser
*/
app.use(require('cookie-parser')('chocolate chip please'));
/*
  Set up Body Parser
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
  Set static folder for public facing files
*/
app.use(express.static('public'));


/*
  Set up session for cookies
*/
app.use(session({
  key: 'lets work with cookies',
  secret: 'chocolate chip please', //needs changed later
  store: sessionStore,
  resave: false,
  saveUninitialized: false
  //cookie: { secure: true }
}))

/*
  Set up passport
*/
app.use(passport.initialize());
app.use(passport.session());


/*
  Set up routes
*/
app.use(require('./routes'));



/*
  Start server
*/
app.listen(app.get('port'), async function() {
  Logger.info(`Express started on port: ${app.get('port')}; press Ctrl-C to terminate.`);
});
