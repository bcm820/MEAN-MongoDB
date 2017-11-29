
const mods = '../../node_modules';
const express = require(`${mods}/express`);
const path = require(`${mods}/path`);
const app = express();
const bp = require(`${mods}/body-parser`);
const mongoose = require(`${mods}/mongoose`);

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended: true}));

const server = app.listen(8000);
const route = require('./routes')(app, server, mongoose);