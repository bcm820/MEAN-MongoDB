
// require express and path
const express = require(`express`);
const path = require(`path`);

// create express app
const app = express();

// require and config bodyParser
const bp = require(`body-parser`);
app.use(bp.urlencoded({extended: true}));

// config ejs, views, and static content
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));

// require mongoose
require(`./server/config/mongoose`);

// require and config session
const session = require(`express-session`);
app.use(session({
    secret: 'thisIsASecret',
    resave: false,
    saveUninitialized: true
}));

// connect routes and launch server
const setRoutes = require('./server/config/routes.js');
setRoutes(app);
app.listen(8000);