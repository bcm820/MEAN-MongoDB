
// require express and path
const express = require('express');
const path = require('path');

// create express app
const app = express();

// require and config bodyParser
const bp = require('body-parser');
app.use(bp.json());

// require mongoose
require('./server/config/mongoose');

// connect routes and launch server
require('./server/config/routes.js')(app);
app.listen(8000);