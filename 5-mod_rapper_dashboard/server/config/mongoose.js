
// require mongoose and supporting modules
const mongoose = require(`mongoose`);
const path = require(`path`);

// connect mongoose and configure path
mongoose.connect('mongodb://localhost/rappers');
var models_path = path.join(__dirname, './../models');

// read all files in models path and require each
const fs = require(`fs`);
fs.readdirSync(models_path).forEach((file) => {
    if(file.indexOf('.js') >= 0) {
      require(models_path + '/' + file);
    }
});