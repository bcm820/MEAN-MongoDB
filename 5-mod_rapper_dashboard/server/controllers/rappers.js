
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
        Rapper.find({}, (err, rappers) => {
            return res.render('index', {rappers, moment});
        }).sort({votes: -1});
    },
    findOne(req, res){
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            return res.render('show', {rapper, moment});
        });
    },
    addForm(req, res){
        let flashes = getFlashes(req);
        return res.render('add', flashes);
    },
    editForm(req, res){
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            let flashes = getFlashes(req);
            return res.render('edit', {rapper, moment, flashes});
        });
    },

    // POST
    create(req, res){
        const rapper = new Rapper(req.body);
        rapper.save((err) => {
            if(err){
                req.session.flashes = err;
                return res.redirect('/rapper/add');
            }
            else { return res.redirect(`/rapper/${rapper._id}`); }
        });
    },
    update(req, res){
        Rapper.findOneAndUpdate({_id:req.params.id},
            req.body, (err, rapper) => {
            if(err){ req.session.flashes = err; }
            return res.redirect(`/rapper/${rapper._id}/edit`);
        });
    },
    upVote(req, res){
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            rapper.votes += 1;
            rapper.save((err) => { return res.redirect('/') });
        });
    },
    downVote(req, res){
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            if(rapper.votes > 0){
                rapper.votes -= 1;
                rapper.save((err) => {});
            }
            return res.redirect(`/`);
        });
    },
    remove(req, res){
        Rapper.findOneAndRemove({_id:req.params.id}, (err) => {
            return res.redirect('/');
        });
    },

}