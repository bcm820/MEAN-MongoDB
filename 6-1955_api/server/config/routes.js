
const people = require('../controllers/people');

module.exports = (app) => {

    // GET
    app.get('/', people.findAll);
    app.get('/:name', people.findOne);
    app.get('/add/:name', people.add);
    app.get('/remove/:name', people.remove);

};