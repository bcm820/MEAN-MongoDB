
// include mongoose and model
const mongoose = require('mongoose');
const Rapper = mongoose.model('Rapper');

// additional requires
const session = require('express-session');
const moment = require('moment');

// create and destroy flash messages
function getFlashes(req){
    let flashes;
    if(req.session.flashes){
        flashes = req.session.flashes;
        req.session.destroy();
    }
    else { flashes = {}; }
    return flashes;
}


module.exports = {

    // GET
    findAll(req, res){
        Rapper.find({}).sort({votes: -1})
        .then(rappers => res.render('index', {rappers, moment}));
    },
    findOne(req, res){
        Rapper.findOne({_id:req.params.id})
        .then(rapper => res.render('show', {rapper, moment}));
    },
    addForm(req, res){
        let flashes = getFlashes(req);
        return res.render('add', flashes);
    },
    editForm(req, res){
        Rapper.findOne({_id:req.params.id})
        .then(rapper => {
            let flashes = getFlashes(req);
            return res.render('edit', {rapper, moment, flashes});
        });
    },

    // POST
    create(req, res){
        Rapper.create(req.body)
        .then(rapper => res.redirect(`/rapper/${rapper._id}`))
        .catch(err => {
            req.session.flashes = err;
            return res.redirect('/rapper/add');
        });
    },
    update(req, res){
        Rapper.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true})
        .then(rapper => res.redirect(`/rapper/${rapper._id}/edit`))
        .catch(err => {
            req.session.flashes = err;
            return res.redirect(`/rapper/${req.params.id}/edit`);
        });
    },
    upVote(req, res){
        Rapper.findOne({_id:req.params.id})
        .then(rapper => {
            rapper.votes++;
            rapper.save(err => res.redirect('/'));
        })
    },
    downVote(req, res){
        Rapper.findOne({_id:req.params.id})
        .then(rapper => {
            if(rapper.votes > 0){
                rapper.votes--;
                rapper.save()
            }
            return res.redirect('/');
        })
    },
    remove(req, res){
        Rapper.findOneAndRemove({_id:req.params.id})
        .then(res.redirect('/'));
    }

}