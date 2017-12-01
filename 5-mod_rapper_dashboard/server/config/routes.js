
const rappers = require('../controllers/rappers');

module.exports = (app) => {

    app.get('/', (req, res) => { // good
        rappers.findAll(req, res); });

    app.get('/rapper/add', (req, res) => { // good
        rappers.addForm(req, res); });

    app.post('/rapper/add', (req, res) => { // good
        rappers.create(req, res); });

    app.get('/rapper/:id', (req, res) => {
        rappers.findOne(req, res); });

    app.get('/rapper/:id/edit', (req, res) => {
        rappers.editForm(req, res); });

    app.post('/rapper/:id/edit', (req, res) => {
        rappers.update(req, res); });

    app.post('/rapper/:id/voteup', (req, res) => {
        rappers.upVote(req, res); });

    app.post('/rapper/:id/votedown', (req, res) => {
        rappers.downVote(req, res); });
        
    app.post('/rapper/:id/delete', (req, res) => {
        rappers.delete(req, res); });

};