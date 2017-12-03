
const tasks = require('../controllers/tasks');

module.exports = (app) => {

    app.route('/api/v1/tasks')
    .get(tasks.list)
    .post(tasks.create);

    app.route('/api/v1/tasks/:id')
    .get(tasks.get)
    .put(tasks.update)
    .delete(tasks.delete);

};