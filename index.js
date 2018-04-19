/*
  Required packages
*/
const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const router = require('./routes/index');

/*
  Set up server
*/
const app = express();

/*
  Set up view engine
*/
app.engine('.hbs', exphbs( {extname: '.hbs', defaultLayout: 'main'} ));
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 12345);

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
  Set up routes
*/
app.use('/', router);

/*
  Start server
*/
app.listen(app.get('port'), () => {
  console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to terminate.');
});
