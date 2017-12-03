
// include mongoose and model
const mongoose = require('mongoose');
const User = mongoose.model('User');

// additional requires
const session = require('express-session');

// create and destroy flash messages
function getFlashes(req){
    let flashes = [];
    if(req.session.flashes){
        for(let x in req.session.flashes.errors){
            if(req.session.flashes.errors[x].message !== undefined){
                flashes.push(req.session.flashes.errors[x].message);
            }
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
            User.findById({_id:req.session.uid})
            .then(user => {
                User.find({})
                .then(users => res.render('index', {user, users}))
            });
        } else { return res.redirect('/'); }
    },

    show(req, res){
        User.findById({_id:req.params.id})
        .then(user => res.render('show', {user}));
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
        let eLogin = {}, pLogin = {}, err = {errors:{eLogin,pLogin}};
        if(req.body.email === '' || req.body._pw === ''){
            if(req.body.email === ''){
                err.errors.eLogin.message = 'Enter your email';
            }
            if(req.body._pw === ''){
                err.errors.pLogin.message = 'Enter your password';
            }
            req.session.flashes = err;
            return res.redirect('/')
        }
        else {
            User.findOne({email:req.body.email}, (err, user) => {
                if(user === null){
                    err = {errors:{eLogin:{message:'Email not found'}}}
                    req.session.flashes = err;
                    return res.redirect('/')
                }
                else {
                    user.checkPW(req.body._pw, (err, good) => {
                        if(err){
                            req.session.flashes = err;
                            return res.redirect('/')
                        }
                        else if(good){
                            req.session.uid = user._id;
                            return res.redirect('/site/')
                        }
                    });
                }
            });
        }
    },

    create(req, res){
        const user = new User(req.body);
        user.save()
        .then(user => {
            req.session.uid = user._id;
            return res.redirect('/site/')
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
    },

    logout(req, res){
        req.session.destroy();
        return res.redirect('/');
    }

}