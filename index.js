/*
  Required packages
*/
const bodyParser  = require('body-parser');
const express     = require('express');
const exphbs      = require('express-handlebars');
const router      = require('./routes/index');

const passport    = require('passport');
const session     = require('express-session');
/*
  Set up server
*/
const app = express();

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

app.use(require('cookie-parser')());
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
  secret: 'chocolate chip please ', //needs changed later
  resave: false,
  saveUninitialized: true
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
  console.log(`Express started on port: ${app.get('port')}; press Ctrl-C to terminate.`);
});
