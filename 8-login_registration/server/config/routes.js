
const users = require('../controllers/users');

module.exports = (app) => {

    // GET
    app.get('/', users.login);
    app.get('/join', users.join);
    app.get('/site/', users.index);
    app.get('/site/users/:id', users.show);
    app.get('/site/users/:id/edit', users.edit);

    // POST
    app.post('/login', users.auth);
    app.post('/join', users.create);
    app.post('/site/users/:id/edit', users.update);
    app.post('/site/users/:id/remove', users.remove);

};