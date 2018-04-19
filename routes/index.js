const express = require('express');
const app = express.Router();

/*
  Main route
*/
app.get('/', (req, res) => {
  res.render('index');
});

/*
  Routes for error handling
*/
app.use( (req, res) => {
  res.status(404);
  res.render('404');
});

app.use( (err, req, res, next) => {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

module.exports = app;
