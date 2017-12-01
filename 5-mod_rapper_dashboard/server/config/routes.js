
const rappers = require('../controllers/rappers');

module.exports = (app) => {

    // GET
    app.get('/', rappers.findAll);
    app.get('/rapper/:id', rappers.findOne);
    app.get('/rapper/add', rappers.addForm);
    app.get('/rapper/:id/edit', rappers.editForm);

    // POST
    app.post('/rapper/add', rappers.create);
    app.post('/rapper/:id/edit', rappers.update);
    app.post('/rapper/:id/voteup', rappers.upVote);
    app.post('/rapper/:id/votedown', rappers.downVote);  
    app.post('/rapper/:id/delete', rappers.remove);

};