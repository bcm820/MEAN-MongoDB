
// include mongoose and model
const mongoose = require(`mongoose`);
const Person = mongoose.model('Person');

module.exports = {

    findAll(req, res){
        Person.find({})
        .then(people => res.json(people))
        .catch(err => res.json(err));
    },

    findOne(req, res){
        Person.findOne(req.params)
        .then(person => { res.json(person ? person: 'No one found!'); })
        .catch(err => res.json(err));
    },

    add(req, res){
        Person.create(req.params)
        .then(person => res.json(person))
        .catch(err => res.json(err));
    },

    remove(req, res){
        Person.findOneAndRemove(req.params)
        .then(result => res.redirect('/'))
        .catch(err => res.json(err));
    },

}