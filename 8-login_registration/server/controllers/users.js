
// include mongoose and model
const mongoose = require('mongoose');
const User = mongoose.model('User');

// additional requires
const session = require('express-session');
const moment = require('moment');

// create and destroy flash messages
function getFlashes(req){
    let flashes = [];
    if(req.session.flashes){
        for(let x in req.session.flashes.errors){
            flashes.push(req.session.flashes.errors[x].message);
        } req.session.flashes = null;
    } return flashes;
}

// get invalid user info
function getUserinfo(req){
    let userInfo = {email:'',first:'',last:'',_pw:'',_pwconf:'',bday:'',gender:''}
    if(req.session.userInfo){ userInfo = req.session.userInfo; }
    req.session.userInfo = null;
    return userInfo
}

// remove moment
module.exports = {

    // GET
    login(req, res){
        let flashes = getFlashes(req);
        return res.render('login', {flashes});
    },

    join(req, res){
        let flashes = getFlashes(req);
        let user = getUserinfo(req);
        return res.render('join', {user, flashes});
    },

    index(req, res){
        if(req.session.uid){
            User.findOne({_id:req.session.uid})
            .then(user => {
                User.find({})
                .then(users => res.render('index', {user, users}))
            });
        } else { res.redirect('/'); }
    },

    show(req, res){
        User.findById({_id:req.params.id})
        .then(user => res.render('show', {user, moment}));
    },

    edit(req, res){
        User.findById({_id:req.params.id})
        .then(user => {
            let flashes = getFlashes(req);
            return res.render('edit', {user, flashes});
        });
    },

    // POST
    auth(req, res){
        User.findOne({email:req.body.email})
        .then(user => {
            user.checkPW(req.body._pw)
            .then(confirmed => {
                if(confirmed){
                    req.session.uid = user._id;
                    res.redirect('/site/');
                }
            })
            .catch(err => {
                req.session.flashes = err;
                return res.redirect('/');
            });
        })
        .catch(err => {
            req.session.flashes = err;
            return res.redirect('/');
        });
    },

    create(req, res){
        const user = new User(req.body);
        user.save()
        .then(user => {
            req.session.uid = user._id;
            res.redirect('/site/')
        })
        .catch(err => {
            req.session.flashes = err;
            req.session.userInfo = user;
            return res.redirect('/join');
        });
    },

    update(req, res){
        User.findByIdAndUpdate({_id:req.params.id},
            req.body, {runValidators:true, context: 'query'})
        .then(user => res.redirect(`/site/users/${user._id}/edit`))
        .catch(err => {
            req.session.flashes = err;
            return res.redirect(`/site/users/${req.params.id}/edit`);
        });
    },

    remove(req, res){
        User.findByIdAndRemove({_id:req.params.id})
        .then(res.redirect('/site/'));
    }

}