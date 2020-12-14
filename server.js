const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const SECRETKEY = 'I want to pass COMPS381F';
const db = require('./db');
const login = require('./login');
const register = require('./register');
const index = require('./index');
const logout = require('./logout');


app.set('view engine','ejs');

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', index);

app.get('/register', register);

app.post('/register', register);

app.get('/login', login);

app.post('/login', login);

app.get('/logout', logout);

app.get('/display', db);

app.get('/create', db);

app.post('/search', db);

app.get('/edit', db);

app.get('/rate', db);

app.get('/delete', db);

app.get('/gmap', db);

app.post('/update', db);

app.listen(process.env.PORT || 8099);
