
// include mongoose and model
const mongoose = require(`mongoose`);
const Person = mongoose.model('Person');

module.exports = {

    findAll(req, res){
        Person.find({}, (err, people) => { return res.json(people); });
    },

    findOne(req, res){
        Person.findOne({name:req.params.name}, (err, person) => { return res.json(person); });
    },

    add(req, res){
        const person = new Person({name:req.params.name});
        person.save((err) => { return res.redirect('/') });
    },

    remove(req, res){
        Person.findOneAndRemove({name:req.params.name}, (err) => { return res.redirect('/'); });
    },

}