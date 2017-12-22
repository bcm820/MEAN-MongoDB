
const express = require(`express`);
const path = require(`path`);
const app = express();
const bp = require(`body-parser`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);

app.use(express.static(path.join(__dirname, './views')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended: true}));
app.use(session({
    secret: 'thisIsASecret',
    resave: false,
    saveUninitialized: true
}));

const server = app.listen(8000);
const route = require('./routes')(app, server, mongoose, session);