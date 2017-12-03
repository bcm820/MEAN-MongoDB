
// include mongoose and model
const mongoose = require(`mongoose`);
const Task = mongoose.model('Task');

module.exports = {

    list(req, res){
        Task.find({})
        .then(tasks => res.json(tasks))
        .catch(err => res.send(err));
    },

    create(req, res){
        Task.create(req.body)
        .then(task => res.json(task))
        .catch(err => res.send(err));
    },

    get(req, res){
        Task.findById(req.params)
        .then(task => { res.json(task ? task : 'No task found!'); })
        .catch(err => res.send(err));
    },

    update(req, res){
        Task.findOneAndUpdate(req.params, req.body, {new:true})
        .then(task => res.json(task))
        .catch(err => res.send(err));
    },

    delete(req, res){
        Task.findOneAndRemove(req.params)
        .then(result => res.send({result: 'Task deleted'}))
        .catch(err => res.send(err));
    },

}